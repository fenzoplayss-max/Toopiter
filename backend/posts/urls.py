"""
URLs for posts app.
"""

from django.urls import path, include

app_name = 'posts'

urlpatterns = [
    path('', include('posts.api_urls')),
]
