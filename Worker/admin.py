from django.contrib import admin
from .models import Attendences, HourWage
from datetime import datetime
# Register your models here.

@admin.register(Attendences)
class AttendencesAdmin(admin.ModelAdmin):
    list_display = (
        "worker", 
        "date", 
        "shift",
        "entry_time", 
        "leaving_time", 
        "overtime_entry_time",
        "overtime_leaving_time",
        "get_total_time", 
        "get_extra_time"
    )
    list_filter = ("date", "worker") 
    search_fields = ("worker__user__username",)
    ordering = ("-date", "worker")

    def get_total_time(self, obj):
        if obj.entry_time and obj.leaving_time:
            start = datetime.combine(obj.date, obj.entry_time)
            end = datetime.combine(obj.date, obj.leaving_time)
            total_seconds = (end - start).total_seconds()
            hours = total_seconds / 3600
            return f"{hours:.2f} hrs"
        return "-"

    get_total_time.short_description = "Total Hours"

    def get_extra_time(self, obj):
        if obj.overtime and obj.overtime_entry_time and obj.overtime_leaving_time:
            start = datetime.combine(obj.date, obj.overtime_entry_time)
            end = datetime.combine(obj.date, obj.overtime_leaving_time)
            total_seconds = (end - start).total_seconds()
            hours = total_seconds / 3600
            return f"{hours:.2f} hrs"
        return "-"
    get_extra_time.short_description = "Extra Hours"

@admin.register(HourWage)
class SalaryConfigAdmin(admin.ModelAdmin):
    list_display = ("hourly_wage", "overtime_wage",)
    search_fields = ("hourly_rate", "overtime_wage",)