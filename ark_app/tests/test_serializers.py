import pytest
from django.contrib.auth.models import User
from django.utils import timezone
from ark_app.serializers import RegisterSerializer, UserProfileSerializer, GameSessionSerializer, LeaderboardSerializer, AchievementSerializer, FriendshipSerializer, UserSearchSerializer
from ark_app.models import UserProfile, GameSession, Leaderboard, Achievement, Friendship

@pytest.mark.django_db
def test_register_serializer():
    data = {'username': 'new', 'email': 'new@example.com', 'password': 'pass12345'}  # 9 символов
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid()
    user = serializer.save()
    assert User.objects.filter(username='new').exists()

@pytest.mark.django_db
def test_register_serializer_invalid():
    data = {'username': 'short', 'email': 'invalid', 'password': 'short'}
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert 'password' in serializer.errors  # Min length

@pytest.mark.django_db
def test_userprofile_serializer_create_update():
    user = User.objects.create_user(username='test', password='test')
    profile = UserProfile.objects.get(user=user)  # Получаем существующий профиль
    
    # Обновляем существующий профиль
    update_data = {'bio': 'new bio'}
    serializer = UserProfileSerializer(profile, data=update_data, partial=True)
    assert serializer.is_valid()
    updated = serializer.save()
    assert updated.bio == 'new bio'

@pytest.mark.django_db
def test_gamesession_serializer():
    user = User.objects.create_user(username='test', password='test')
    data = {'game_state': {}, 'score': 100, 'level': 1, 'time_played': '00:05:00', 'is_completed': False, 'difficulty': 'medium'}
    serializer = GameSessionSerializer(data=data)
    assert serializer.is_valid()
    session = serializer.save(user=user)
    assert session.score == 100

@pytest.mark.django_db
def test_leaderboard_serializer():
    user = User.objects.create_user(username='test', password='test')
    data = {'score': 100, 'difficulty': 'medium'}
    serializer = LeaderboardSerializer(data=data)
    assert serializer.is_valid()
    # Создаем объект с явным указанием rank
    leaderboard = Leaderboard.objects.create(
        user=user, 
        score=100, 
        rank=1,  # Явно указываем rank
        difficulty='medium'
    )
    # Тестируем сериализацию существующего объекта
    serializer = LeaderboardSerializer(leaderboard)
    assert serializer.data['score'] == 100
    assert serializer.data['rank'] == 1

@pytest.mark.django_db
def test_achievement_serializer():
    user = User.objects.create_user(username='test', password='test')
    data = {'user': user.id, 'name': 'Test', 'description': 'desc'}
    serializer = AchievementSerializer(data=data)
    assert serializer.is_valid()
    ach = serializer.save()
    assert ach.name == 'Test'

@pytest.mark.django_db
def test_friendship_serializer():
    user = User.objects.create_user(username='test', password='test')
    friend = User.objects.create_user(username='friend', password='test')
    # Создаем объект напрямую через модель
    friendship = Friendship.objects.create(from_user=user, to_user=friend)
    
    # Тестируем сериализацию существующего объекта
    serializer = FriendshipSerializer(friendship)
    assert serializer.data['to_user']['username'] == 'friend'
    assert serializer.data['from_user']['username'] == 'test'
    
    # Альтернативно: тестируем создание через сериализатор с правильным форматом данных
    # (если нужно тестировать именно создание)
    data = {'to_user': friend.id}
    serializer = FriendshipSerializer(data=data)
    assert serializer.is_valid() is True  # Но save() не сработает из-за read_only полей

@pytest.mark.django_db
def test_usersearch_serializer():
    User.objects.create_user(username='test', password='test')
    serializer = UserSearchSerializer(User.objects.all(), many=True)
    assert len(serializer.data) > 0
    assert 'username' in serializer.data[0]