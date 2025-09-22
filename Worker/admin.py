from django.contrib import admin
from .models import Attendences

# Register your models here.
@admin.register(Attendences)
class AttendencesAdmin(admin.ModelAdmin):
    list_display = (
        "worker", 
        "date", 
        "entry_time", 
        "leaving_time", 
        "get_total_time", 
        "get_extra_time"
    )
    list_filter = ("date", "worker") 
    search_fields = ("worker__user__username",)
    ordering = ("-date", "worker")

    def get_total_time(self, obj):
        return round(obj.total_time, 2) if obj.total_time else "-"
    get_total_time.short_description = "Total Hours"

    def get_extra_time(self, obj):
        return round(obj.extra_time, 2) if obj.extra_time else "-"
    get_extra_time.short_description = "Extra Hours"