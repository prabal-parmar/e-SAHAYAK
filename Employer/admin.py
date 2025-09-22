from django.contrib import admin
from .models import ConnectionRequest, Connections
# Register your models here.

@admin.register(ConnectionRequest)
class ConnectionRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "receiver", "status", "created_at")
    search_fields = ("sender__username", "receiver__username", "status")
    list_filter = ("status", "created_at")

@admin.register(Connections)
class ConnectionsAdmin(admin.ModelAdmin):
    list_display = ("id", "employer", "worker", "created_at")
    search_fields = ("employer__username", "worker__username")
    list_filter = ("created_at",)