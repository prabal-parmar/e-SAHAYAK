from django.db import models

# Create your models here.

# Assuming extra time starts after 9 hours
class Attendences(models.Model):
    worker = models.ForeignKey("Users.WorkerModel", on_delete=models.CASCADE, related_name="worker_profile")
    date = models.DateField(auto_now_add=True)
    entry_time = models.DateTimeField(auto_now_add=True)
    leaving_time = models.DateTimeField(blank=True, null=True)
    
    @property
    def total_time(self):
        if self.leaving_time:
            time = self.leaving_time - self.entry_time
            return time.total_seconds() / 3600
        return None
    
    @property
    def extra_time(self):
        if self.leaving_time and not self.total_time and self.total_time > 9:
            time = self.total_time - 9
            return time
        return None
