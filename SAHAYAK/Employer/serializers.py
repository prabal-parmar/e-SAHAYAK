from rest_framework import serializers
from .models import ReportEmployerModel

class ReportEmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportEmployerModel
        fields = "__all__"