from django.shortcuts import render
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from django.db.models import Max
from .models import UserProfile, GameSession, Leaderboard, Achievement, Friendship
from .serializers import (
    RegisterSerializer, UserProfileSerializer, GameSessionSerializer,
    LeaderboardSerializer, AchievementSerializer, FriendshipSerializer,
    UserSearchSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        try:
            user = serializer.save()
        except ValidationError as e:
            raise ValidationError(e.detail)
        except Exception as e:
            raise ValidationError({"detail": str(e)})
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            raise ValidationError({"detail": "Profile already exists for this user. Try login or contact admin."})

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'user_id': token.user_id})

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

class GameSessionView(generics.ListCreateAPIView):
    serializer_class = GameSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GameSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise serializers.ValidationError({"detail": str(e)})

class GameSessionDetailView(generics.RetrieveAPIView):
    serializer_class = GameSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GameSession.objects.filter(user=self.request.user)

class LeaderboardView(generics.ListCreateAPIView):
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Leaderboard.objects.all()
        difficulty = self.request.query_params.get('difficulty')
        date = self.request.query_params.get('date')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if date:
            queryset = queryset.filter(date_achieved__date=date)
        return queryset.order_by('-score')

    def perform_create(self, serializer):
        max_rank = Leaderboard.objects.aggregate(Max('rank'))['rank__max'] or 0
        serializer.save(user=self.request.user, rank=max_rank + 1, date_achieved=timezone.now())

class AchievementView(generics.ListAPIView):
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user)

class FriendshipView(generics.ListCreateAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(from_user=self.request.user) | Friendship.objects.filter(to_user=self.request.user) 

    def perform_create(self, serializer):
        to_user_id = self.request.data.get('to_user')
        if not to_user_id:
            raise serializers.ValidationError({"to_user": "This field is required."})
        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"to_user": "User not found."})
        if Friendship.objects.filter(from_user=self.request.user, to_user=to_user).exists():
            raise serializers.ValidationError({"detail": "Friend request already sent."})
        serializer.save(from_user=self.request.user, to_user=to_user)

class FriendshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(from_user=self.request.user)

class FriendProgressView(generics.ListAPIView):
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        friend_id = self.kwargs['friend_id']
        if Friendship.objects.filter(from_user=self.request.user, to_user_id=friend_id, accepted=True).exists() or \
           Friendship.objects.filter(to_user=self.request.user, from_user_id=friend_id, accepted=True).exists():
            return Leaderboard.objects.filter(user_id=friend_id)
        raise PermissionDenied("Not friends or request not accepted")

class FriendshipAcceptView(generics.UpdateAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(to_user=self.request.user, accepted=False)

    def perform_update(self, serializer):
        serializer.save(accepted=True)

class UserSearchView(generics.ListAPIView):
    serializer_class = UserSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('query', '')
        return User.objects.filter(username__icontains=query).exclude(id=self.request.user.id)

def game_view(request):
    return render(request, 'index.html')