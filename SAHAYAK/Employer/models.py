from django.db import models

# Create your models here.
class WorkersWorkModel(models.Model):
    employer = models.ForeignKey("Users.EmployerModel", on_delete=models.CASCADE, related_name="employer_name")
    date = models.DateField(auto_now_add=True)
    worker = models.ForeignKey("Users.WorkerModel", on_delete=models.CASCADE, related_name="worker_name")

    def __str__(self):
        return f"{self.worker} - {self.date}"
