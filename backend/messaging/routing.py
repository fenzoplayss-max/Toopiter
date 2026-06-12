"""
WebSocket routing for messaging app.
"""

from django.urls import re_path
from .consumers import ChatConsumer

websocket_patterns = [
    re_path(r'ws/messages/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
]
