"""
ASGI config for Toopiter project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toopiter.settings')

django_asgi_app = get_asgi_application()

# Import routing after Django setup
from messaging.routing import websocket_patterns as messaging_patterns
from notifications.routing import websocket_patterns as notifications_patterns

websocket_patterns = messaging_patterns + notifications_patterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_patterns)
        )
    ),
})
