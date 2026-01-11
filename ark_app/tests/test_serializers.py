import pytest
from django.contrib.auth.models import User
from ark_app.serializers import RegisterSerializer, UserProfileSerializer, GameSessionSerializer, LeaderboardSerializer, AchievementSerializer, FriendshipSerializer, UserSearchSerializer

@pytest.mark.django_db
def test_register_serializer():
    data = {'username': 'new', 'email': 'new@example.com', 'password': 'pass123'}
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid()
    user = serializer.save()
    assert User.objects.filter(username='new').exists()

@pytest.mark.django_db
def test_userprofile_serializer():
    user = User.objects.create_user(username='test', password='test')
    profile = UserProfile.objects.create(user=user)
    serializer = UserProfileSerializer(profile)
    assert 'user' in serializer.data
    assert serializer.data['user']['username'] == 'test'

# Аналогично для других serializers, проверяя валидацию и create/update