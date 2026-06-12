"""
URL configuration for Toopiter project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/engagement/', include('engagement.urls')),
    path('api/feeds/', include('feeds.urls')),
    path('api/messages/', include('messaging.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/search/', include('search.urls')),
    path('api/trending/', include('trending.urls')),
    path('api/moderation/', include('moderation.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/premium/', include('premium.urls')),
    
    # Core API
    path('api/', include('api.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error pages
handler404 = 'core.views.error_404'
handler500 = 'core.views.error_500'
