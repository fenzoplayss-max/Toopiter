"""
ASGI config for toopiter project.
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

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                messaging_patterns + notifications_patterns
            )
        )
    ),
})
