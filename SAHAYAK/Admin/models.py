from django.db import models

# Create your models here.
class ResolvedReportsModel(models.Model):
    report = models.ForeignKey('Worker.ReportWorkerModel', on_delete=models.CASCADE, related_name='report')
    admin_message = models.TextField()

    def __str__(self):
        return f"{self.id} - {self.report}"
