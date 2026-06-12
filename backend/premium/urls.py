"""
URLs for premium app.
"""

from django.urls import path, include

app_name = 'premium'

urlpatterns = [
    path('', include('premium.api_urls')),
]
