import pytest
from django.contrib.admin.sites import AdminSite
from django.http import HttpRequest
from ark_app.admin import GameSessionAdmin
from ark_app.models import GameSession
from django.contrib.auth.models import User
from django.utils import timezone

@pytest.mark.django_db
def test_export_xlsx():
    user = User.objects.create_user(username='test', password='test')
    session = GameSession.objects.create(user=user, game_state={}, score=100, level=1, time_played=timezone.timedelta(0), is_completed=False, difficulty='medium')
    admin_site = AdminSite()
    admin_model = GameSessionAdmin(GameSession, admin_site)
    request = HttpRequest()
    request.user = user
    queryset = GameSession.objects.all()
    response = admin_model.export_to_xlsx(request, queryset)
    assert response.status_code == 200
    assert 'sessions.xlsx' in response['Content-Disposition']