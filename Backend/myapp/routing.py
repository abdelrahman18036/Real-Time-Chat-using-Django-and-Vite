from django.urls import re_path
from myapp.consumers import ChatConsumer, OnlineStatusConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/$', ChatConsumer.as_asgi()),
    re_path(r'^ws/online/$', OnlineStatusConsumer.as_asgi()),
]
