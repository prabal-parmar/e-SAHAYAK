from django.db import models

# Create your models here.

# Assuming extra time starts after 9 hours
class Attendences(models.Model):
    SHIFT_CHOICES = (
        ("shift1", "Shift1"),
        ("shift2", "Shift2")
    )
    RESPONSE_CHOICES = (
        ("satisfied", "Safisfied"),
        ("report", "Report"),
        ("pending", "Pending")
    )
    worker = models.ForeignKey("Users.WorkerModel", on_delete=models.CASCADE, related_name="attendances")
    employer = models.ForeignKey("Users.EmployerModel", on_delete=models.CASCADE, related_name="attendances")
    date = models.DateField(auto_now_add=True)

    shift = models.CharField(max_length=10, choices=SHIFT_CHOICES, default='shift1')
    entry_time = models.TimeField(blank=True, null=True)
    leaving_time = models.TimeField(blank=True, null=True)
    
    overtime = models.BooleanField(default=False)
    overtime_entry_time = models.TimeField(blank=True, null=True)
    overtime_leaving_time = models.TimeField(blank=True, null=True)
    description = models.TextField(blank=True, null=True, default="No work description.")
    worker_response = models.CharField(max_length=10, choices=RESPONSE_CHOICES, default="pending")
    @property
    def total_time(self):
        if self.leaving_time:
            start = self.entry_time.hour * 3600 + self.entry_time.minute * 60 + self.entry_time.second
            end = self.leaving_time.hour * 3600 + self.leaving_time.minute * 60 + self.leaving_time.second
            return (end - start)/3600
        return 0
    
    @property
    def extra_time(self):
        if self.overtime and self.overtime_entry_time and self.overtime_leaving_time:
            start = self.overtime_entry_time.hour * 3600 + self.overtime_entry_time.minute * 60 + self.overtime_entry_time.second
            end = self.overtime_leaving_time.hour * 3600 + self.overtime_leaving_time.minute * 60 + self.overtime_leaving_time.second
            return (end - start)/3600
        return 0
    
    def __str__(self):
        return f"{self.worker} - {self.date} ({self.shift})"

class HourWage(models.Model):
    hourly_wage = models.DecimalField(max_digits=10, decimal_places=2, default=50)
    overtime_wage = models.DecimalField(max_digits=10, decimal_places=2, default=60)

    def __str__(self):
        return f"Hourly Wage - {self.hourly_wage}"
    
class ReportWorkerModel(models.Model):

    REASON_CHOICES = (
        ("salary", "Salary"),
        ("attendance", "Attendance"),
        ("behaviour", "Behaviour"),
        ("other", "Other")
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("resolved", "Resolved")
    )

    worker = models.ForeignKey('Users.WorkerModel', on_delete=models.CASCADE, related_name='reports')
    employer = models.ForeignKey('Users.EmployerModel', on_delete=models.CASCADE, related_name='reports')
    attendance = models.ForeignKey('Attendences', on_delete=models.CASCADE, related_name='reports')
    message = models.TextField(default="No message regarding report by worker.", blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=10, choices=REASON_CHOICES, default="other")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.worker} -> {self.employer}"
    