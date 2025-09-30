from rest_framework import serializers
from .models import Attendences, ReportWorkerModel

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendences
        fields = "__all__"

class ReportWorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportWorkerModel
        fields = "__all__"
