# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import OnlineStatus

@receiver(post_save, sender=User)
def create_online_status(sender, instance, created, **kwargs):
    if created:
        OnlineStatus.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_online_status(sender, instance, **kwargs):
    instance.onlinestatus.save()
