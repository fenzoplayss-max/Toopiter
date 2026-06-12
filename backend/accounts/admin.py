"""
Admin configuration for accounts app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, Follow, Block, Mute


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'is_verified', 'is_premium', 'is_staff', 'date_joined']
    list_filter = ['is_verified', 'is_premium', 'is_staff', 'is_suspended', 'date_joined']
    search_fields = ['username', 'email', 'profile__display_name']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Verification & Premium', {
            'fields': ('is_verified', 'is_premium')
        }),
        ('2FA', {
            'fields': ('two_factor_enabled', 'two_factor_secret')
        }),
        ('Suspension', {
            'fields': ('is_suspended', 'suspension_reason', 'suspended_until')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Verification & Premium', {
            'fields': ('is_verified', 'is_premium')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'display_name', 'followers_count', 'following_count', 'posts_count', 'is_private']
    list_filter = ['is_private', 'theme', 'created_at']
    search_fields = ['user__username', 'display_name', 'bio']
    readonly_fields = ['followers_count', 'following_count', 'posts_count']
    
    fieldsets = [
        ('Profile Info', {
            'fields': ['user', 'display_name', 'bio', 'website', 'location', 'birth_date']
        }),
        ('Media', {
            'fields': ['avatar', 'banner']
        }),
        ('Preferences', {
            'fields': ['theme', 'is_private', 'show_media', 'allow_mentions', 'allow_dms']
        }),
        ('Notifications', {
            'fields': ['email_notifications', 'push_notifications']
        }),
        ('Stats', {
            'fields': ['followers_count', 'following_count', 'posts_count']
        }),
    ]


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ['follower', 'following', 'created_at']
    list_filter = ['created_at']
    search_fields = ['follower__username', 'following__username']
    raw_id_fields = ['follower', 'following']


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ['blocker', 'blocked', 'created_at']
    list_filter = ['created_at']
    search_fields = ['blocker__username', 'blocked__username']
    raw_id_fields = ['blocker', 'blocked']


@admin.register(Mute)
class MuteAdmin(admin.ModelAdmin):
    list_display = ['muter', 'muted', 'created_at', 'expires_at']
    list_filter = ['created_at']
    search_fields = ['muter__username', 'muted__username']
    raw_id_fields = ['muter', 'muted']
