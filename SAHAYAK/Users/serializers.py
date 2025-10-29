from rest_framework import serializers
from .models import EmployerModel, WorkerModel, EChowk, WorkerExtendedRegistration
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
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = WorkerModel
        fields = ["first_name", "last_name", "username", "password", "role", "skill", "gender", "contact_number", "address"]
    
    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop("password")
        role = validated_data.pop("role", "worker")
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")

        user = User.objects.create_user(username=username, 
                                        password=password, 
                                        role=role,first_name=first_name,
                                        last_name=last_name,)
        worker = WorkerModel.objects.create(user=user, **validated_data)
        return worker

class EChowkSerializer(serializers.ModelSerializer):
    class Meta:
        model = EChowk
        fields = ["chowkId", "chowk_name", "chowk_code", "chowk_address", "pincode", "chowk_type", "chowk_email"]
        read_only_fields = ["chowkId"]

class WorkerExtendedRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerExtendedRegistration
        fields = ["username", "registration_type", "data", "created_at"]
        read_only_fields = ["created_at"]