from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, EmployerModel, WorkerModel
# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = [field.name for field in CustomUser._meta.fields]  # show all fields
    search_fields = ("username", "email")  # quick search
    list_filter = ("role", "is_staff", "is_active")  # quick filters

@admin.register(EmployerModel)
class EmployerAdmin(admin.ModelAdmin):
    list_display = [field.name for field in EmployerModel._meta.fields]  # show all fields
    search_fields = ("org_name", "location")  # quick search

@admin.register(WorkerModel)
class WorkerAdmin(admin.ModelAdmin):
    list_display = [field.name for field in WorkerModel._meta.fields]  # show all fields
    search_fields = ("skill", "contact_number")  # quick search
    list_filter = ("gender",)  # filter by gender
