from rest_framework import serializers
from .models import Attendences, ReportModel

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendences
        fields = "__all__"

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportModel
        fields = "__all__"
        