"""
URLs for feeds app.
"""

from django.urls import path, include

app_name = 'feeds'

urlpatterns = [
    path('', include('feeds.api_urls')),
]
