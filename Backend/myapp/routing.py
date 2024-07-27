# myproject/routing.py

from django.urls import re_path

from myapp.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/$', ChatConsumer.as_asgi()),  # Ensure this regex correctly matches your WebSocket URL
]

