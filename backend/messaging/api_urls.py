"""
API URLs for messaging app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConversationViewSet, MessageViewSet, 
    conversation_detail, mark_as_read
)

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:conversation_id>/detail/', conversation_detail, name='conversation-detail'),
    path('<int:conversation_id>/read/', mark_as_read, name='mark-as-read'),
]
