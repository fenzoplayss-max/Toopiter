"""
API URLs for notifications app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Placeholder views - to be implemented
class NotificationViewSet:
    pass

def mark_as_read(request, pk):
    pass

def mark_all_as_read(request):
    pass

def get_unread_count(request):
    pass

# router = DefaultRouter()
# router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = [
    # path('', include(router.urls)),
    # path('<int:pk>/read/', mark_as_read, name='notification-read'),
    # path('read-all/', mark_all_as_read, name='notification-read-all'),
    # path('unread-count/', get_unread_count, name='notification-unread-count'),
]
