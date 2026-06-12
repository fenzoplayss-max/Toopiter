"""
WebSocket routing for notifications app.
"""

from django.urls import re_path
from .consumers import NotificationConsumer

websocket_patterns = [
    re_path(r'ws/notifications/$', NotificationConsumer.as_asgi()),
]
