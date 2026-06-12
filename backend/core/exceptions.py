"""
Custom exception handler for DRF.
"""

from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
import logging

logger = logging.getLogger(__name__)


class ToopiterAPIException(APIException):
    """Base exception for Toopiter API."""
    status_code = 500
    default_detail = 'An unexpected error occurred.'
    default_code = 'error'


class RateLimitExceeded(ToopiterAPIException):
    """Raised when rate limit is exceeded."""
    status_code = 429
    default_detail = 'Rate limit exceeded. Please try again later.'
    default_code = 'rate_limit_exceeded'


class ContentModerationError(ToopiterAPIException):
    """Raised when content fails moderation."""
    status_code = 403
    default_detail = 'Content violates community guidelines.'
    default_code = 'content_violation'


class UserBlockedError(ToopiterAPIException):
    """Raised when interaction is blocked."""
    status_code = 403
    default_detail = 'This action is not available.'
    default_code = 'user_blocked'


def custom_exception_handler(exc, context):
    """
    Custom exception handler that adds additional context to errors.
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        # Log the exception
        logger.warning(f'API Exception: {exc}', exc_info=True)
        
        # Add request path to response
        request = context.get('request')
        if request:
            response.data['path'] = request.path
        
        # Standardize error format
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                response.data['message'] = response.data.pop('detail')
        
    return response
