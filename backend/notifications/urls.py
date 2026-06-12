"""
URLs for notifications app.
"""

from django.urls import path, include

app_name = 'notifications'

urlpatterns = [
    path('', include('notifications.api_urls')),
]
