from django.db import models

# Create your models here.
class WorkersWorkModel(models.Model):
    employer = models.ForeignKey("Users.EmployerModel", on_delete=models.CASCADE, related_name="works")
    date = models.DateField(auto_now_add=True)
    worker = models.ForeignKey("Users.WorkerModel", on_delete=models.CASCADE, related_name="works")

    def __str__(self):
        return f"{self.worker} - {self.date}"
    
class ReportEmployerModel(models.Model):
    REASON_CHOICES = (
        ("salary", "Salary"),
        ("behaviour", "Behaviour"),
        ("other", "Other")
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("resolved", "Resolved")
    )

    employer = models.ForeignKey('Users.EmployerModel', on_delete=models.CASCADE, related_name='employer_reports')
    worker = models.ForeignKey('Users.WorkerModel', on_delete=models.CASCADE, related_name='worker_reports')
    date = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=10, choices=REASON_CHOICES, default="other")
    message = models.TextField(default="No message regarding report by Employer.", blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
