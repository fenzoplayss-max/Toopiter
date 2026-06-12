"""
URLs for messaging app.
"""

from django.urls import path, include

app_name = 'messaging'

urlpatterns = [
    path('', include('messaging.api_urls')),
]
