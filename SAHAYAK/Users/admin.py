from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, EmployerModel, WorkerModel, EChowk, WorkerExtendedRegistration
# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = [field.name for field in CustomUser._meta.fields]
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_active")

@admin.register(EmployerModel)
class EmployerAdmin(admin.ModelAdmin):
    list_display = [field.name for field in EmployerModel._meta.fields]
    search_fields = ("org_name", "location")

@admin.register(WorkerModel)
class WorkerAdmin(admin.ModelAdmin):
    list_display = [field.name for field in WorkerModel._meta.fields]
    search_fields = ("skill", "contact_number")
    list_filter = ("gender",)

@admin.register(EChowk)
class EChowkAdmin(admin.ModelAdmin):
    list_display = [field.name for field in EChowk._meta.fields]
    search_fields = ("chowk_name", "chowk_code")

@admin.register(WorkerExtendedRegistration)
class WorkerExtendedRegistrationAdmin(admin.ModelAdmin):
    list_display = [field.name for field in WorkerExtendedRegistration._meta.fields]
    search_fields = ("username", "registration_type")
