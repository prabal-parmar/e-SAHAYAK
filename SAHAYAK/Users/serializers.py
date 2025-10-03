from rest_framework import serializers
from .models import EmployerModel, WorkerModel
from django.contrib.auth import get_user_model

User = get_user_model()

class EmployerRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    role = serializers.CharField(write_only=True, default="employer")

    class Meta:
        model = EmployerModel
        fields = ["username", "email", "password", "role", "org_name", "location", "contact_number"]

    def create(self, validated_data):
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        role = validated_data.pop("role", "employer")

        user = User.objects.create_user(username=username, email=email, password=password, role=role)
        employer = EmployerModel.objects.create(user=user, **validated_data)
        return employer
    
class WorkerRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    role = serializers.CharField(write_only=True, default="worker")

    class Meta:
        model = WorkerModel
        fields = ["username", "password", "role", "skill", "gender", "contact_number", "address"]
    
    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop("password")
        role = validated_data.pop("role", "worker")

        user = User.objects.create_user(username=username, password=password, role=role)
        worker = WorkerModel.objects.create(user=user, **validated_data)
        return worker