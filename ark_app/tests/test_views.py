import pytest
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from rest_framework import status

@pytest.mark.django_db
def test_register_view():
    client = APIClient()
    response = client.post('/api/register/', {'username': 'test', 'email': 'test@example.com', 'password': 'pass123'})
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
    client = APIClient()
    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/api/profile/')
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_profile_view_unauthenticated():
    client = APIClient()
    response = client.get('/api/profile/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

# Аналогично для других views: GameSession, Leaderboard, Friendship, etc.
# Для CRUD: post for create, get for list, put for update, delete for destroy

@pytest.mark.django_db
def test_friend_request():
    user = User.objects.create_user(username='test', password='pass123')
    friend = User.objects.create_user(username='friend', password='pass123')
    client = APIClient()
    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.post('/api/friends/', {'to_user': friend.id})
    assert response.status_code == status.HTTP_201_CREATED