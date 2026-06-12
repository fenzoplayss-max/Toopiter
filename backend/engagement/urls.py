"""
URLs for engagement app.
"""

from django.urls import path, include

app_name = 'engagement'

urlpatterns = [
    path('', include('engagement.api_urls')),
]
