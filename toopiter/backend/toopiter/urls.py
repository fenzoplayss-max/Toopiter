"""
URL configuration for toopiter project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # App APIs
    path('api/v1/accounts/', include('accounts.api_urls')),
    path('api/v1/posts/', include('posts.api_urls')),
    path('api/v1/media/', include('media.api_urls')),
    path('api/v1/feeds/', include('feeds.api_urls')),
    path('api/v1/engagement/', include('engagement.api_urls')),
    path('api/v1/messaging/', include('messaging.api_urls')),
    path('api/v1/notifications/', include('notifications.api_urls')),
    path('api/v1/search/', include('search.api_urls')),
    path('api/v1/trending/', include('trending.api_urls')),
    path('api/v1/moderation/', include('moderation.api_urls')),
    path('api/v1/analytics/', include('analytics.api_urls')),
    path('api/v1/premium/', include('premium.api_urls')),
    
    # Health check
    path('health/', lambda request: __import__('json').dumps({'status': 'healthy'}), name='health'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "Toopiter Admin"
admin.site.site_title = "Toopiter Administration"
admin.site.index_title = "Welcome to Toopiter Administration"
