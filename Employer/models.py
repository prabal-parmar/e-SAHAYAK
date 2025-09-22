from django.db import models

# Create your models here.
class Connections(models.Model):
    employer = models.ForeignKey("Users.EmployerModel", on_delete=models.CASCADE, related_name="worker_connections")
    worker = models.ForeignKey("Users.WorkerModel", on_delete=models.CASCADE, related_name="employer_connections")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employer", "worker")

    def __str__(self):
        return f"{self.employer.org_name} - {self.worker.user.username}"
    
class ConnectionRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    )

    sender = models.ForeignKey("Users.EmployerModel", on_delete=models.CASCADE, related_name="sent_connection_requests")
    receiver = models.ForeignKey("Users.WorkerModel", on_delete=models.CASCADE, related_name="received_connection_requests")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.org_name} - {self.receiver.user.username} ({self.status})"
