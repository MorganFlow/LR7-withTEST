from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class UserProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

class GameSession(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_state = models.JSONField()
    score = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    time_played = models.DurationField(default=timezone.timedelta(0))
    is_completed = models.BooleanField(default=False)
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Лёгкая'), ('medium', 'Средняя'), ('hard', 'Тяжёлая')], default='medium')  # Для уровней сложности

class Leaderboard(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    rank = models.IntegerField()
    date_achieved = models.DateTimeField(auto_now_add=True)
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Лёгкая'), ('medium', 'Средняя'), ('hard', 'Тяжёлая')], default='medium')

class Achievement(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    achieved_at = models.DateTimeField(auto_now_add=True)

class Friendship(TimeStampedModel):
    from_user = models.ForeignKey(User, related_name='friends_from', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friends_to', on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)