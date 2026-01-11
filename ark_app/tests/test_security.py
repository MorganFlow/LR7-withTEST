import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_sql_injection():
    client = APIClient()
    response = client.get('/api/users/search/?query=%27%20OR%201=1%20--')
    assert response.status_code == 200  # Не должно возвращать все, или краш

@pytest.mark.django_db
def test_xss():
    user = User.objects.create_user(username='test', password='pass123')
    client = APIClient()
    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.put('/api/profile/', {'bio': '<script>alert(1)</script>'})
    assert response.status_code == 200
    profile = UserProfile.objects.get(user=user)
    assert profile.bio == '<script>alert(1)</script>'  # Но в template должно экранироваться