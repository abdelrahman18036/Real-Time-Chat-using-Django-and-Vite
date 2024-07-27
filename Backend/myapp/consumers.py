from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.contrib.auth.models import User
from .models import Contact

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

    def disconnect(self, close_code):
        # Leave the user's room group
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )

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

                    # Send message to the sender's group
                    async_to_sync(self.channel_layer.group_send)(
                        sender_room_group_name,
                        {
                            'type': 'chat_message',
                            'message': message,
                            'sender': self.user.username,
                        }
                    )

                    # Send message to the recipient's group
                    if sender_room_group_name != recipient_room_group_name:
                        async_to_sync(self.channel_layer.group_send)(
                            recipient_room_group_name,
                            {
                                'type': 'chat_message',
                                'message': message,
                                'sender': self.user.username,
                            }
                        )
                    print(f"Message routed to {recipient_room_group_name} and {sender_room_group_name}")
            except User.DoesNotExist:
                self.send(text_data=json.dumps({'error': 'Contact user does not exist.'}))
                print(f"Failed to find user {contact_username}")

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))
