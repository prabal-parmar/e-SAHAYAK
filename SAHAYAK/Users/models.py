from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    USER_TYPE = (
        ('employer', 'Employer'),
        ('worker', 'Worker')
    )
    role = models.CharField(max_length=10, choices=USER_TYPE)

    def __str__(self):
        return f"{self.username} - ({self.role})"

class EmployerModel(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="employer_profile")
    org_name = models.CharField(max_length=100)
    location= models.CharField(max_length=100)

    def __str__(self):
        return self.org_name


class WorkerModel(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="worker_profile")
    email = models.EmailField(_("email address"), blank=True, null=True, unique=False)
    skill = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=[("M", "Male"), ("F", "Female"), ("O", "Other")])
    contact_number = models.CharField(max_length=10)
    address = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.user.username