"""
URLs for trending app.
"""

from django.urls import path, include

app_name = 'trending'

urlpatterns = [
    path('', include('trending.api_urls')),
]
