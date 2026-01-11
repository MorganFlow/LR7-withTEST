import pytest
from django.contrib.auth.models import User
from django.utils import timezone
from ark_app.models import UserProfile, GameSession, Leaderboard, Achievement, Friendship
from django.db.utils import IntegrityError

@pytest.mark.django_db
def test_create_userprofile():
    user = User.objects.create_user(username='test', password='test')
    profile = UserProfile.objects.get(user=user)
    profile.bio = 'bio'
    profile.date_of_birth = '2000-01-01'
    profile.save()
    assert profile.user == user
    assert profile.bio == 'bio'
    assert profile.created_at is not None
    assert profile.updated_at is not None

@pytest.mark.django_db
def test_gamesession_create():
    user = User.objects.create_user(username='test', password='test')
    session = GameSession.objects.create(user=user, game_state={}, score=100, level=1, time_played=timezone.timedelta(minutes=5), is_completed=False, difficulty='medium')
    assert session.user == user
    assert session.score == 100

@pytest.mark.django_db
def test_leaderboard_create():
    user = User.objects.create_user(username='test', password='test')
    leaderboard = Leaderboard.objects.create(user=user, score=100, rank=1, difficulty='medium')
    assert leaderboard.user == user
    assert leaderboard.rank == 1

@pytest.mark.django_db
def test_achievement_create():
    user = User.objects.create_user(username='test', password='test')
    achievement = Achievement.objects.create(user=user, name='Test', description='desc')
    assert achievement.user == user
    assert achievement.name == 'Test'

@pytest.mark.django_db
def test_friendship_create():
    user = User.objects.create_user(username='test', password='test')
    friend = User.objects.create_user(username='friend', password='test')
    friendship = Friendship.objects.create(from_user=user, to_user=friend, accepted=False)
    assert friendship.from_user == user
    assert friendship.to_user == friend
    assert friendship.accepted == False

@pytest.mark.django_db
def test_unique_friendship():
    user = User.objects.create_user(username='test', password='test')
    friend = User.objects.create_user(username='friend', password='test')
    Friendship.objects.create(from_user=user, to_user=friend)
    with pytest.raises(IntegrityError):
        Friendship.objects.create(from_user=user, to_user=friend)