"""
Common mixins for class-based views.
"""

from django.contrib.auth.mixins import UserPassesTestMixin
from rest_framework import status
from rest_framework.response import Response
from .exceptions import UserBlockedError


class BlockCheckMixin:
    """
    Mixin to check if the current user is blocked by the target user.
    """
    def get_target_user(self):
        """Override this method to return the target user."""
        raise NotImplementedError("get_target_user must be implemented")
    
    def dispatch(self, request, *args, **kwargs):
        target_user = self.get_target_user()
        
        if target_user and hasattr(request.user, 'is_blocked_by'):
            if request.user.is_blocked_by(target_user):
                raise UserBlockedError()
        
        return super().dispatch(request, *args, **kwargs)


class OwnerOrReadOnlyMixin:
    """
    Mixin that allows read-only access to anyone, but write access only to owners.
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user == view.get_object().user if hasattr(view.get_object(), 'user') else False


class PaginationMixin:
    """
    Mixin for common pagination settings.
    """
    page_size = 20
    max_page_size = 100
    page_size_query_param = 'limit'
    max_page_size_query_param = 'max_limit'


class CacheMixin:
    """
    Mixin for adding caching headers to responses.
    """
    cache_timeout = 60  # seconds
    
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        
        if request.method == 'GET' and response.status_code == 200:
            response['Cache-Control'] = f'public, max-age={self.cache_timeout}'
        
        return response
