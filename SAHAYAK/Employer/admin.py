from django.contrib import admin
from .models import ReportEmployerModel, WorkersWorkModel
# Register your models here.

@admin.register(ReportEmployerModel)
class WorkerReports(admin.ModelAdmin):
    list_display = ("worker", "employer", "reason", "message", "status", "date",)
    search_fields = ("worker", "employer", "status","date",)

@admin.register(WorkersWorkModel)
class AllWorks(admin.ModelAdmin):
    list_display = ("worker", "employer", "date",)
    search_fields = ("worker", "employer", "date",)