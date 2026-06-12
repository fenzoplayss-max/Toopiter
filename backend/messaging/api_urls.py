"""
API URLs for messaging app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Placeholder views - to be implemented
class ConversationViewSet:
    pass

class MessageViewSet:
    pass

def conversation_detail(request, conversation_id):
    pass

def mark_as_read(request, conversation_id):
    pass

# router = DefaultRouter()
# router.register(r'conversations', ConversationViewSet, basename='conversation')
# router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    # path('', include(router.urls)),
    # path('<int:conversation_id>/detail/', conversation_detail, name='conversation-detail'),
    # path('<int:conversation_id>/read/', mark_as_read, name='mark-as-read'),
]
