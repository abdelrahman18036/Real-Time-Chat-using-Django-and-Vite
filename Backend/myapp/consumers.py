from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.contrib.auth.models import User
from .models import Contact, OnlineStatus
from django.db.models import Q
from django.utils import timezone

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            self.close()
        else:
            self.room_name = f"user_{self.user.username}"
            self.room_group_name = f"chat_{self.room_name}"

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
            self.update_online_status(True)
            print(f"{self.user.username} connected and added to {self.room_group_name}")

    def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )

        self.update_online_status(False)
        print(f"{self.user.username} disconnected from {self.room_group_name}")

    def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        contact_username = data.get('contact')

        if message and contact_username:
            try:
                contact_user = User.objects.get(username=contact_username)
                if Contact.objects.filter(user=self.user, contact=contact_user, accepted=True).exists() or Contact.objects.filter(user=contact_user, contact=self.user, accepted=True).exists():
                    sender_room_group_name = f"chat_user_{self.user.username}"
                    recipient_room_group_name = f"chat_user_{contact_username}"

                    async_to_sync(self.channel_layer.group_send)(
                        recipient_room_group_name,
                        {
                            'type': 'chat_message',
                            'message': message,
                            'sender': self.user.username,
                        }
                    )

                    print(f"Message routed to {recipient_room_group_name}")
            except User.DoesNotExist:
                self.send(text_data=json.dumps({'error': 'Contact user does not exist.'}))
                print(f"Failed to find user {contact_username}")

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'type': 'chat_message'
        }))

    def update_online_status(self, is_online):
        status, created = OnlineStatus.objects.get_or_create(user=self.user)
        status.is_online = is_online
        status.last_seen = timezone.now()
        status.save()
        self.broadcast_online_status()

    def broadcast_online_status(self):
        online_status = {
            user.username: {
                'is_online': user.onlinestatus.is_online,
                'last_seen': user.onlinestatus.last_seen.isoformat()
            }
            for user in User.objects.all()
        }
        async_to_sync(self.channel_layer.group_send)(
            "online_status_broadcast",
            {
                'type': 'online_status',
                'online_status': online_status
            }
        )

    def online_status(self, event):
        online_status = event['online_status']
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
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()
            self.broadcast_online_status()
            print(f"{self.user.username} connected and added to {self.room_group_name}")

    def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )
        self.broadcast_online_status()

    def receive(self, text_data):
        pass

    def broadcast_online_status(self):
        online_status = {
            user.username: {
                'is_online': user.onlinestatus.is_online,
                'last_seen': user.onlinestatus.last_seen.isoformat()
            }
            for user in User.objects.all()
        }
        async_to_sync(self.channel_layer.group_send)(
            "online_status_broadcast",
            {
                'type': 'online_status',
                'online_status': online_status
            }
        )

    def online_status(self, event):
        online_status = event['online_status']
        self.send(text_data=json.dumps({
            'type': 'online_status',
            'online_status': online_status
        }))
