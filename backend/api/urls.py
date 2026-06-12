"""
Main API URLs for Toopiter.
This provides a unified entry point for all API endpoints.
"""

from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

@extend_schema(exclude=True)
@api_view(['GET'])
def api_root(request):
    """API Root - Returns available endpoints"""
    return Response({
        'message': 'Welcome to Toopiter API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/',
            'posts': '/api/posts/',
            'engagement': '/api/engagement/',
            'feeds': '/api/feeds/',
            'messages': '/api/messages/',
            'notifications': '/api/notifications/',
            'search': '/api/search/',
            'trending': '/api/trending/',
            'moderation': '/api/moderation/',
            'analytics': '/api/analytics/',
            'premium': '/api/premium/',
            'docs': '/api/docs/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
]
