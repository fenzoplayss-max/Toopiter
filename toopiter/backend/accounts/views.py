"""
Views for accounts app.
"""

from django.contrib.auth import get_user_model
from django.db.models import Q, Count
from django.core.cache import cache
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Follow, Block, Mute
from .serializers import (
    UserSerializer, UserLiteSerializer, UserProfileSerializer,
    UserRegisterSerializer, UserLoginSerializer, PasswordChangeSerializer,
    FollowSerializer, BlockSerializer, MuteSerializer
)
from core.mixins import CacheMixin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """User login endpoint."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        identifier = serializer.validated_data['username_or_email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get_by_username_or_email(identifier)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if user.is_suspended:
            return Response(
                {'error': 'Account suspended'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Update last active
        user.last_active = timezone.now()
        user.save(update_fields=['last_active'])
        
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class LogoutView(APIView):
    """User logout endpoint - blacklists refresh token."""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Successfully logged out'})
        except Exception:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile."""
    
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class UserDetailView(generics.RetrieveAPIView):
    """Get user details by username or ID."""
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self):
        lookup = self.kwargs.get('identifier')
        
        # Try to get by username first
        try:
            return User.objects.select_related('profile').get(username__iexact=lookup)
        except User.DoesNotExist:
            pass
        
        # Try by ID
        try:
            return User.objects.select_related('profile').get(pk=lookup)
        except User.DoesNotExist:
            raise NotFound("User not found")


class UserSearchView(generics.ListAPIView):
    """Search users by username or display name."""
    
    serializer_class = UserLiteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()
        
        if not query:
            return User.objects.none()
        
        # Exclude blocked and muted users
        blocked_ids = []
        muted_ids = []
        
        if self.request.user.is_authenticated:
            blocked_ids = list(Block.objects.filter(blocker=self.request.user).values_list('blocked_id', flat=True))
            muted_ids = list(Mute.objects.filter(muter=self.request.user).values_list('muted_id', flat=True))
        
        exclude_ids = blocked_ids + muted_ids + [self.request.user.id] if self.request.user.is_authenticated else []
        
        queryset = User.objects.filter(
            Q(username__icontains=query) | Q(profile__display_name__icontains=query)
        ).exclude(id__in=exclude_ids).select_related('profile')[:50]
        
        return queryset


class FollowView(APIView):
    """Follow/Unfollow a user."""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if target_user == request.user:
            return Response({'error': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already following
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=target_user
        )
        
        if not created:
            return Response({'message': 'Already following'}, status=status.HTTP_200_OK)
        
        # Create notification (will be implemented in notifications app)
        # notify_follow(request.user, target_user)
        
        return Response({'message': f'Now following @{target_user.username}'}, status=status.HTTP_201_CREATED)
    
    def delete(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        Follow.objects.filter(follower=request.user, following=target_user).delete()
        
        return Response({'message': f'Unfollowed @{target_user.username}'}, status=status.HTTP_200_OK)


class FollowersView(generics.ListAPIView):
    """List user's followers."""
    
    serializer_class = UserLiteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        user = generics.get_object_or_404(User, username__iexact=username)
        
        # Apply blocking/muting filters
        if self.request.user.is_authenticated:
            blocked_ids = list(Block.objects.filter(blocker=self.request.user).values_list('blocked_id', flat=True))
        else:
            blocked_ids = []
        
        return User.objects.filter(
            followers__following=user
        ).exclude(id__in=blocked_ids).select_related('profile')


class FollowingView(generics.ListAPIView):
    """List users that a user follows."""
    
    serializer_class = UserLiteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        user = generics.get_object_or_404(User, username__iexact=username)
        
        return User.objects.filter(
            following__follower=user
        ).select_related('profile')


class BlockView(APIView):
    """Block/Unblock a user."""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if target_user == request.user:
            return Response({'error': 'Cannot block yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        Block.objects.get_or_create(blocker=request.user, blocked=target_user)
        
        return Response({'message': f'Blocked @{target_user.username}'})
    
    def delete(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        Block.objects.filter(blocker=request.user, blocked=target_user).delete()
        
        return Response({'message': f'Unblocked @{target_user.username}'})


class MuteView(APIView):
    """Mute/Unmute a user."""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if target_user == request.user:
            return Response({'error': 'Cannot mute yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        duration = request.data.get('duration')  # in hours
        
        Mute.objects.get_or_create(muter=request.user, muted=target_user)
        
        return Response({'message': f'Muted @{target_user.username}'})
    
    def delete(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        Mute.objects.filter(muter=request.user, muted=target_user).delete()
        
        return Response({'message': f'Unmuted @{target_user.username}'})


class SuggestionsView(generics.ListAPIView):
    """Get user suggestions to follow."""
    
    serializer_class = UserLiteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Get users followed by people you follow (second degree connections)
        following_ids = User.objects.filter(
            followers__follower=self.request.user
        ).values_list('id', flat=True)
        
        suggested_ids = User.objects.filter(
            followers__follower_id__in=following_ids
        ).exclude(
            id__in=[self.request.user.id] + list(following_ids)
        ).annotate(
            mutual_followers=Count('followers')
        ).order_by('-mutual_followers')[:10]
        
        return User.objects.filter(id__in=suggested_ids).select_related('profile')
