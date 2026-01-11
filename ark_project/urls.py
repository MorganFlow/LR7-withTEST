"""
URL configuration for ark_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from ark_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/profile/', views.ProfileView.as_view(), name='profile'),
    path('api/sessions/', views.GameSessionView.as_view(), name='sessions'),
    path('api/sessions/<int:pk>/', views.GameSessionDetailView.as_view(), name='session_detail'),
    path('api/leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('api/achievements/', views.AchievementView.as_view(), name='achievements'),
    path('api/friends/', views.FriendshipView.as_view(), name='friends'),
    path('api/friends/<int:pk>/', views.FriendshipDetailView.as_view(), name='friend_detail'),
    path('api/friends/<int:friend_id>/progress/', views.FriendProgressView.as_view(), name='friend_progress'),
    path('api/users/search/', views.UserSearchView.as_view(), name='user_search'),
    path('api/friends/<int:pk>/accept/', views.FriendshipAcceptView.as_view(), name='friend_accept'),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += [
    path('', views.game_view, name='game'),  # Главная страница
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)