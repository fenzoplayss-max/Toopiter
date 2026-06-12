"""
Common utilities for Toopiter.
"""

import hashlib
import bleach
import re
from django.conf import settings


def sanitize_html(text):
    """
    Sanitize HTML content to prevent XSS attacks.
    """
    allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']
    allowed_attributes = {'a': ['href', 'title', 'rel']}
    allowed_styles = []
    
    return bleach.clean(
        text,
        tags=allowed_tags,
        attributes=allowed_attributes,
        styles=allowed_styles,
        strip=True
    )


def extract_hashtags(text):
    """
    Extract hashtags from text.
    Returns a list of unique hashtags (without #).
    """
    hashtags = re.findall(r'#(\w+)', text)
    return list(set(hashtags))


def extract_mentions(text):
    """
    Extract mentions from text.
    Returns a list of unique usernames (without @).
    """
    mentions = re.findall(r'@(\w+)', text)
    return list(set(mentions))


def extract_urls(text):
    """
    Extract URLs from text.
    Returns a list of unique URLs.
    """
    url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
    urls = re.findall(url_pattern, text)
    return list(set(urls))


def generate_unique_id(prefix=''):
    """
    Generate a unique ID using hash.
    """
    import uuid
    unique_id = str(uuid.uuid4())
    hash_object = hashlib.md5(unique_id.encode())
    short_id = hash_object.hexdigest()[:8]
    return f"{prefix}{short_id}" if prefix else short_id


def get_post_max_length(user):
    """
    Get the maximum post length based on user's premium status.
    """
    if hasattr(user, 'profile') and user.profile.is_premium:
        return settings.PREMIUM_POST_MAX_LENGTH
    return settings.POST_MAX_LENGTH


def truncate_text(text, max_length=280, suffix='...'):
    """
    Truncate text to max_length with suffix.
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def cache_key(*args, **kwargs):
    """
    Generate a cache key from arguments.
    """
    key_parts = [str(arg) for arg in args]
    for k, v in sorted(kwargs.items()):
        key_parts.append(f"{k}:{v}")
    
    return ":".join(key_parts)
