"""
Custom user model for Toopiter.
"""

import re
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from core.validators import validate_username


class UserManager(BaseUserManager):
    """Custom user manager for the User model."""
    
    use_in_migrations = True
    
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError(_('Users must have a username'))
        if not email:
            raise ValueError(_('Users must have an email address'))
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(username, email, password, **extra_fields)
    
    def get_by_username_or_email(self, identifier):
        """Get user by username or email."""
        if '@' in identifier:
            return self.get(email__iexact=identifier)
        return self.get(username__iexact=identifier)


class User(AbstractUser):
    """
    Custom User model for Toopiter.
    Extends Django's AbstractUser with additional fields.
    """
    
    # Additional fields
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(
        _('username'),
        max_length=20,
        unique=True,
        validators=[validate_username],
        help_text=_('Required. 3-20 characters. Letters, numbers, and underscores only.')
    )
    
    # Verification & Premium
    is_verified = models.BooleanField(_('verified'), default=False, help_text=_('Indicates if user has verified badge'))
    is_premium = models.BooleanField(_('premium'), default=False, help_text=_('Indicates if user has premium subscription'))
    
    # Security
    two_factor_enabled = models.BooleanField(_('2FA enabled'), default=False)
    two_factor_secret = models.CharField(_('2FA secret'), max_length=255, blank=True, null=True)
    
    # Account status
    is_suspended = models.BooleanField(_('suspended'), default=False)
    suspension_reason = models.TextField(_('suspension reason'), blank=True, null=True)
    suspended_until = models.DateTimeField(_('suspended until'), blank=True, null=True)
    
    # Timestamps
    last_active = models.DateTimeField(_('last active'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['is_premium']),
        ]
    
    def __str__(self):
        return f"@{self.username}"
    
    @property
    def display_name(self):
        """Return display name or username."""
        if hasattr(self, 'profile') and self.profile.display_name:
            return self.profile.display_name
        return self.username
    
    @property
    def avatar_url(self):
        """Return avatar URL."""
        if hasattr(self, 'profile') and self.profile.avatar:
            return self.profile.avatar.url
        return None
    
    def is_blocked_by(self, other_user):
        """Check if this user is blocked by another user."""
        if not other_user:
            return False
        return Block.objects.filter(blocker=other_user, blocked=self).exists()
    
    def blocks(self, other_user):
        """Check if this user blocks another user."""
        if not other_user:
            return False
        return Block.objects.filter(blocker=self, blocked=other_user).exists()
    
    def is_following(self, other_user):
        """Check if this user follows another user."""
        if not other_user:
            return False
        return Follow.objects.filter(follower=self, following=other_user).exists()
    
    def is_followed_by(self, other_user):
        """Check if this user is followed by another user."""
        if not other_user:
            return False
        return Follow.objects.filter(follower=other_user, following=self).exists()


class UserProfile(models.Model):
    """
    Extended profile information for users.
    One-to-one relationship with User.
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Profile info
    display_name = models.CharField(_('display name'), max_length=50, blank=True)
    bio = models.TextField(_('bio'), blank=True, max_length=160)
    website = models.URLField(_('website'), blank=True, max_length=255)
    location = models.CharField(_('location'), max_length=100, blank=True)
    birth_date = models.DateField(_('birth date'), blank=True, null=True)
    
    # Media
    avatar = models.ImageField(_('avatar'), upload_to='avatars/', blank=True, null=True)
    banner = models.ImageField(_('banner'), upload_to='banners/', blank=True, null=True)
    
    # Theme preferences
    theme = models.CharField(_('theme'), max_length=10, choices=[
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('system', 'System'),
    ], default='system')
    
    # Privacy settings
    is_private = models.BooleanField(_('private account'), default=False)
    show_media = models.BooleanField(_('show media in profile'), default=True)
    allow_mentions = models.BooleanField(_('allow mentions'), default=True)
    allow_dms = models.BooleanField(_('allow direct messages'), default=True)
    
    # Notification settings
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    push_notifications = models.BooleanField(_('push notifications'), default=True)
    
    # Stats (denormalized for performance)
    followers_count = models.PositiveIntegerField(_('followers count'), default=0)
    following_count = models.PositiveIntegerField(_('following count'), default=0)
    posts_count = models.PositiveIntegerField(_('posts count'), default=0)
    
    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Profile of @{self.user.username}"
    
    def update_counts(self):
        """Update follower/following counts."""
        self.followers_count = Follow.objects.filter(following=self.user).count()
        self.following_count = Follow.objects.filter(follower=self.user).count()
        self.posts_count = self.user.posts.count()
        self.save(update_fields=['followers_count', 'following_count', 'posts_count'])


class Follow(models.Model):
    """
    Follow relationship between users.
    """
    
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('follow')
        verbose_name_plural = _('follows')
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['follower', '-created_at']),
            models.Index(fields=['following', '-created_at']),
        ]
    
    def __str__(self):
        return f"@{self.follower.username} → @{self.following.username}"
    
    def save(self, *args, **kwargs):
        # Prevent self-following
        if self.follower == self.following:
            raise ValueError("Users cannot follow themselves")
        super().save(*args, **kwargs)
        
        # Update counts
        self.following.profile.update_counts()
        self.follower.profile.update_counts()
    
    def delete(self, *args, **kwargs):
        following_user = self.following
        follower_user = self.follower
        super().delete(*args, **kwargs)
        
        # Update counts
        following_user.profile.update_counts()
        follower_user.profile.update_counts()


class Block(models.Model):
    """
    Block relationship between users.
    """
    
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocking')
    blocked = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_by')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('block')
        verbose_name_plural = _('blocks')
        unique_together = ('blocker', 'blocked')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"@{self.blocker.username} blocked @{self.blocked.username}"
    
    def save(self, *args, **kwargs):
        # Prevent self-blocking
        if self.blocker == self.blocked:
            raise ValueError("Users cannot block themselves")
        
        # Auto-unfollow when blocking
        Follow.objects.filter(
            models.Q(follower=self.blocker, following=self.blocked) |
            models.Q(follower=self.blocked, following=self.blocker)
        ).delete()
        
        super().save(*args, **kwargs)


class Mute(models.Model):
    """
    Mute relationship - user won't see muted user's posts.
    """
    
    muter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='muting')
    muted = models.ForeignKey(User, on_delete=models.CASCADE, related_name='muted_by')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    expires_at = models.DateTimeField(_('expires at'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('mute')
        verbose_name_plural = _('mutes')
        unique_together = ('muter', 'muted')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"@{self.muter.username} muted @{self.muted.username}"
