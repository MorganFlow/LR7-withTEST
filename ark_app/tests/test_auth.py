import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_guest_no_access():
    client = APIClient()
    response = client.get('/api/profile/')
    assert response.status_code == 401

@pytest.mark.django_db
def test_user_access():
    user = User.objects.create_user(username='test', password='pass123')
    client = APIClient()
    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/api/profile/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_admin_access():
    admin = User.objects.create_superuser(username='admin', password='admin123', email='admin@example.com')
    client = APIClient()
    token = Token.objects.create(user=admin)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/admin/')
    assert response.status_code == 302  # Redirect to admin index
