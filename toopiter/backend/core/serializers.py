"""
Common serializers for Toopiter.
"""

from rest_framework import serializers


class TimestampSerializer(serializers.Serializer):
    """
    Serializer that adds created_at and updated_at fields.
    """
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class UserLiteSerializer(serializers.Serializer):
    """
    Lightweight user serializer for nested representations.
    """
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    display_name = serializers.CharField(read_only=True)
    avatar_url = serializers.ImageField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)


class CountSerializer(serializers.Serializer):
    """
    Serializer for count fields.
    """
    likes_count = serializers.IntegerField(read_only=True, default=0)
    reposts_count = serializers.IntegerField(read_only=True, default=0)
    replies_count = serializers.IntegerField(read_only=True, default=0)
    views_count = serializers.IntegerField(read_only=True, default=0)
    bookmarks_count = serializers.IntegerField(read_only=True, default=0)
