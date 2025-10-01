from django.contrib import admin
from .models import ReportEmployerModel
# Register your models here.

@admin.register(ReportEmployerModel)
class WorkerReports(admin.ModelAdmin):
    list_display = ("worker", "employer", "reason", "message", "status", "date",)
    search_fields = ("worker", "employer", "status","date",)