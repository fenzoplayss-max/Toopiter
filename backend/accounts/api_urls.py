"""
API URLs for accounts app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView,
    UserDetailView, UserSearchView, FollowView, FollowersView,
    FollowingView, BlockView, MuteView, SuggestionsView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Current user profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/suggestions/', SuggestionsView.as_view(), name='suggestions'),
    
    # User search
    path('search/', UserSearchView.as_view(), name='user-search'),
    
    # User details by username or ID
    path('<str:identifier>/', UserDetailView.as_view(), name='user-detail'),
    
    # Follow/Unfollow
    path('<str:username>/follow/', FollowView.as_view(), name='follow'),
    path('<str:username>/followers/', FollowersView.as_view(), name='followers'),
    path('<str:username>/following/', FollowingView.as_view(), name='following'),
    
    # Block/Unblock
    path('<str:username>/block/', BlockView.as_view(), name='block'),
    
    # Mute/Unmute
    path('<str:username>/mute/', MuteView.as_view(), name='mute'),
]
