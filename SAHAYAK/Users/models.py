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

    
class EChowk(models.Model):
    CHOWK_TYPE = (
        ('construction', 'Construction'),
        ('market', 'Market'),
        ('industrial', 'Industrial'),
        ('rural', 'Rural'),
        ('other', 'Other')
    )

    chowkId = models.CharField(max_length=10)
    chowk_name = models.CharField(max_length=20)
    chowk_code = models.CharField(max_length=20)
    chowk_address = models.TextField()
    pincode = models.CharField(max_length=6)
    chowk_type = models.CharField(max_length=20, choices=CHOWK_TYPE)
    chowk_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return self.chowk_name

class EmployerModel(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="employer_profile")
    org_name = models.CharField(max_length=100)
    location= models.CharField(max_length=100)
    contact_number = models.CharField(max_length=10)
    def __str__(self):
        return self.org_name


class WorkerModel(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="worker_profile")
    email = models.EmailField(_("email address"), blank=True, null=True, unique=False)
    skill = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=[("M", "Male"), ("F", "Female"), ("O", "Other")])
    contact_number = models.CharField(max_length=10)
    address = models.TextField(blank=True, null=True)
    chowk = models.ForeignKey(EChowk, on_delete=models.CASCADE, related_name='chowk', null=True, blank=True)
    def __str__(self):
        return self.user.username