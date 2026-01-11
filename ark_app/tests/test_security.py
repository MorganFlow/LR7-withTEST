import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from ark_app.models import UserProfile

@pytest.mark.django_db
def test_sql_injection():
    # Создаем пользователя и получаем токен
    user = User.objects.create_user(username='test', password='pass123')
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    
    response = client.get('/api/users/search/?query=%27%20OR%201=1%20--')
    # Проверяем, что запрос не падает с ошибкой
    assert response.status_code in [200, 400, 404]

@pytest.mark.django_db
def test_xss():
    user = User.objects.create_user(username='test', password='pass123')
    client = APIClient()
    token = Token.objects.create(user=user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    
    # Проверяем, что XSS-код сохраняется (но будет экранирован в шаблоне)
    response = client.put('/api/profile/', {'bio': '<script>alert(1)</script>'}, format='json')
    assert response.status_code == 200
    
    profile = UserProfile.objects.get(user=user)
    assert profile.bio == '<script>alert(1)</script>'