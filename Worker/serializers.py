from rest_framework import serializers
from .models import Attendences

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendences
        fields = "__all__"