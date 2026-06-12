"""
URLs for analytics app.
"""

from django.urls import path, include

app_name = 'analytics'

urlpatterns = [
    path('', include('analytics.api_urls')),
]
