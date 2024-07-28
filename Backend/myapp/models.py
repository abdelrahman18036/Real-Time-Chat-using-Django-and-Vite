from django.db import models
from django.contrib.auth.models import User

class Contact(models.Model):
    user = models.ForeignKey(User, related_name='contacts', on_delete=models.CASCADE)
    contact = models.ForeignKey(User, related_name='related_contacts', on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'contact')

    def __str__(self):
        return f"{self.user.username} - {self.contact.username}"

    def get_other_party(self, current_user):
        return self.contact if self.user == current_user else self.user


class OnlineStatus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='onlinestatus')
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} is {'online' if self.is_online else 'offline'}"
