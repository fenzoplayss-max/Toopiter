"""
Common validators for Toopiter.
"""

import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_username(value):
    """
    Validate username format.
    - 3-20 characters
    - Only letters, numbers, and underscores
    - Must start with a letter
    """
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9_]{2,19}$', value):
        raise ValidationError(
            _('Username must be 3-20 characters long, start with a letter, '
              'and contain only letters, numbers, and underscores.')
        )


def validate_bio(value):
    """
    Validate bio length.
    - Maximum 160 characters
    """
    if len(value) > 160:
        raise ValidationError(_('Bio cannot exceed 160 characters.'))


def validate_hashtag(value):
    """
    Validate hashtag format.
    - 1-50 characters after #
    - Letters, numbers, and underscores only
    """
    tag = value.lstrip('#')
    if not tag or len(tag) > 50:
        raise ValidationError(_('Hashtag must be 1-50 characters long.'))
    
    if not re.match(r'^[a-zA-Z0-9_]+$', tag):
        raise ValidationError(_('Hashtag can only contain letters, numbers, and underscores.'))


def validate_content_length(value, max_length=280):
    """
    Validate post content length.
    """
    if len(value) > max_length:
        raise ValidationError(_(f'Content cannot exceed {max_length} characters.'))
    
    if len(value.strip()) == 0:
        raise ValidationError(_('Content cannot be empty.'))


def url_validator(value):
    """
    Basic URL validator.
    """
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or IP
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    if not url_pattern.match(value):
        raise ValidationError(_('Enter a valid URL.'))
