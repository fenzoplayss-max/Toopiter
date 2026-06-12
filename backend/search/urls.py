"""
URLs for search app.
"""

from django.urls import path, include

app_name = 'search'

urlpatterns = [
    path('', include('search.api_urls')),
]
