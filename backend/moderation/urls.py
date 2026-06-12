"""
URLs for moderation app.
"""

from django.urls import path, include

app_name = 'moderation'

urlpatterns = [
    path('', include('moderation.api_urls')),
]
