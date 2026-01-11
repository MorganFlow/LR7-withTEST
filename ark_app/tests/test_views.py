import pytest
from rest_framework.test import APIClient
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from ark_app.models import GameSession, Leaderboard, Friendship, Achievement

@pytest.mark.django_db
def test_register_view():
    client = APIClient()
    response = client.post('/api/register/', {'username': 'test', 'email': 'test@example.com', 'password': 'pass12345'})
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_login_view():
    user = User.objects.create_user(username='test', password='pass123')
    client = APIClient()
    response = client.post('/api/login/', {'username': 'test', 'password': 'pass123'})
    assert response.status_code == status.HTTP_200_OK
    assert 'token' in response.data

@pytest.mark.django_db
def test_profile_view_authenticated():
    user = User.objects.create_user(username='test', password='pass123')
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/api/profile/')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_profile_view_unauthenticated():
    client = APIClient()
    response = client.get('/api/profile/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

# Для GameSession (CRUD)
@pytest.mark.django_db
def test_gamesession_list_create():
    user = User.objects.create_user(username='test', password='pass123')
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.post('/api/sessions/', 
                          {'game_state': {}, 'score': 100, 'level': 1, 'time_played': '00:05:00', 
                           'is_completed': False, 'difficulty': 'medium'},
                          format='json')
    assert response.status_code == status.HTTP_201_CREATED

# Для Leaderboard (CRUD)
@pytest.mark.django_db
def test_leaderboard_list_create():
    user = User.objects.create_user(username='test', password='pass123')
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.post('/api/leaderboard/', {'score': 100, 'difficulty': 'medium'})
    assert response.status_code == status.HTTP_201_CREATED

    response = client.get('/api/leaderboard/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1

# Для Friendship (CRUD, включая accept)
@pytest.mark.django_db
def test_friendship_list_create():
    user = User.objects.create_user(username='test', password='pass123')
    friend = User.objects.create_user(username='friend', password='pass123')
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.post('/api/friends/', {'to_user': friend.id})
    assert response.status_code == status.HTTP_201_CREATED

    response = client.get('/api/friends/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0

    # Принимаем от имени друга
    friendship_id = response.data[0]['id']
    friend_token = Token.objects.create(user=friend)
    client.credentials(HTTP_AUTHORIZATION='Token ' + friend_token.key)
    response = client.patch(f'/api/friends/{friendship_id}/accept/', {})
    assert response.status_code == status.HTTP_200_OK

# Для Achievement
@pytest.mark.django_db
def test_achievement_list():
    user = User.objects.create_user(username='test', password='pass123')
    Achievement.objects.create(user=user, name='Test', description='desc')
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/api/achievements/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1