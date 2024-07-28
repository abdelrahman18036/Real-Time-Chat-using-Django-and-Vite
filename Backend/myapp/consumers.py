from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.contrib.auth.models import User
from .models import Contact, OnlineStatus
from django.db.models import Q

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            self.close()
        else:
            self.room_name = f"user_{self.user.username}"
            self.room_group_name = f"chat_{self.room_name}"

            # Join the user's own room group
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
            print(f"{self.user.username} connected and added to {self.room_group_name}")

            # Update online status
            self.update_online_status(True)

    def disconnect(self, close_code):
        # Leave the user's room group
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )

        # Update online status
        self.update_online_status(False)

    def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        contact_username = data.get('contact')

        if message and contact_username:
            try:
                contact_user = User.objects.get(username=contact_username)
                if Contact.objects.filter(user=self.user, contact=contact_user, accepted=True).exists() or Contact.objects.filter(user=contact_user, contact=self.user, accepted=True).exists():
                    recipient_room_group_name = f"chat_user_{contact_username}"

                    # Send message to the recipient's group
                    async_to_sync(self.channel_layer.group_send)(
                        recipient_room_group_name,
                        {
                            'type': 'chat_message',
                            'message': message,
                            'sender': self.user.username,
                            'recipient': contact_username
                        }
                    )
                    print(f"Message sent to {recipient_room_group_name}")
            except User.DoesNotExist:
                self.send(text_data=json.dumps({'error': 'Contact user does not exist.'}))
                print(f"Failed to find user {contact_username}")

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender': sender
        }))

    def update_online_status(self, is_online):
        self.user.onlinestatus.is_online = is_online
        self.user.onlinestatus.save()
        self.broadcast_online_status()

    def broadcast_online_status(self):
        online_status = {user.username: user.onlinestatus.is_online for user in User.objects.all()}
        async_to_sync(self.channel_layer.group_send)(
            "online_status_broadcast",
            {
                'type': 'online_status',
                'online_status': online_status
            }
        )

    def online_status(self, event):
        online_status = event['online_status']

        # Send online status to WebSocket
        self.send(text_data=json.dumps({
            'type': 'online_status',
            'online_status': online_status
        }))


class OnlineStatusConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            self.close()
        else:
            self.room_group_name = "online_status_broadcast"

            # Join the group for broadcasting online status
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
            print(f"{self.user.username} connected and added to {self.room_group_name}")

            # Broadcast online status
            self.broadcast_online_status()

    def disconnect(self, close_code):
        # Leave the group for broadcasting online status
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )

        # Broadcast online status
        self.broadcast_online_status()

    def receive(self, text_data):
        pass

    def broadcast_online_status(self):
        online_status = {user.username: user.onlinestatus.is_online for user in User.objects.all()}
        async_to_sync(self.channel_layer.group_send)(
            "online_status_broadcast",
            {
                'type': 'online_status',
                'online_status': online_status
            }
        )

    def online_status(self, event):
        online_status = event['online_status']

        # Send online status to WebSocket
        self.send(text_data=json.dumps({
            'type': 'online_status',
            'online_status': online_status
        }))
