"""
Serializers for accounts app.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from core.validators import validate_username, validate_bio
from .models import UserProfile, Follow, Block, Mute

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Full user serializer."""
    
    profile = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_followed_by = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'display_name', 'avatar_url',
            'is_verified', 'is_premium', 'profile', 'is_following',
            'is_followed_by', 'date_joined', 'last_active'
        ]
        read_only_fields = ['id', 'email', 'is_verified', 'is_premium', 'date_joined']
    
    def get_profile(self, obj):
        return UserProfileSerializer(obj.profile, context=self.context) if hasattr(obj, 'profile') else None
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.is_following(obj)
        return False
    
    def get_is_followed_by(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.is_followed_by(obj)
        return False


class UserLiteSerializer(serializers.ModelSerializer):
    """Lightweight user serializer for nested representations."""
    
    display_name = serializers.CharField(source='profile.display_name', read_only=True)
    avatar_url = serializers.ImageField(source='profile.avatar', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar_url', 'is_verified']
        read_only_fields = fields


class UserProfileSerializer(serializers.ModelSerializer):
    """Profile serializer."""
    
    class Meta:
        model = UserProfile
        fields = [
            'display_name', 'bio', 'website', 'location', 'birth_date',
            'avatar', 'banner', 'theme', 'is_private', 'show_media',
            'allow_mentions', 'allow_dms', 'followers_count',
            'following_count', 'posts_count', 'created_at'
        ]
    
    def validate_bio(self, value):
        validate_bio(value)
        return value


class UserRegisterSerializer(serializers.ModelSerializer):
    """Registration serializer."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']
    
    def validate_username(self, value):
        validate_username(value)
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        
        if User.objects.filter(username__iexact=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})
        
        if User.objects.filter(email__iexact=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists.'})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # Create profile
        UserProfile.objects.create(user=user)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """Login serializer."""
    
    username_or_email = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class PasswordChangeSerializer(serializers.Serializer):
    """Password change serializer."""
    
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        return attrs


class FollowSerializer(serializers.ModelSerializer):
    """Follow relationship serializer."""
    
    follower = UserLiteSerializer(read_only=True)
    following = UserLiteSerializer(read_only=True)
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = fields


class BlockSerializer(serializers.ModelSerializer):
    """Block relationship serializer."""
    
    blocker = UserLiteSerializer(read_only=True)
    blocked = UserLiteSerializer(read_only=True)
    
    class Meta:
        model = Block
        fields = ['id', 'blocker', 'blocked', 'created_at']
        read_only_fields = fields


class MuteSerializer(serializers.ModelSerializer):
    """Mute relationship serializer."""
    
    muter = UserLiteSerializer(read_only=True)
    muted = UserLiteSerializer(read_only=True)
    
    class Meta:
        model = Mute
        fields = ['id', 'muter', 'muted', 'created_at', 'expires_at']
        read_only_fields = fields
