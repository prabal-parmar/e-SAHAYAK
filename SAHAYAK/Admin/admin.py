from django.contrib import admin
from .models import ResolvedReportsModel
# Register your models here.
@admin.register(ResolvedReportsModel)
class ResolvedReportsByAdmin(admin.ModelAdmin):
    list_display = ("report", "admin_message",)
    search_fields = ("report",)