from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from Users.models import CustomUser, WorkerModel
from Worker.models import Attendences
from .models import WorkersWorkModel
from datetime import date, datetime
from django.utils import timezone
from Worker.serializers import AttendanceSerializer
# Create your views here.


# All workers working today under employer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_workers_working_today(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile

    todays_date = timezone.localdate()
    all_workers_working_today = WorkersWorkModel.objects.filter(employer=employer, date=todays_date).all().values()

    return Response({"message": "All Worker Working Today Fetched", "workers": all_workers_working_today}, status=status.HTTP_200_OK)

# Add shift and entry time for worker
@api_view(['POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def mark_entry_time(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile

    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker_id = request.data.get("worker")

    worker = WorkerModel.objects.filter(id = worker_id).first()
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.data.get("leaving_time"):
        return Response({"error": "You can only add entry time here"}, status=status.HTTP_400_BAD_REQUEST)
    
    if (not request.data.get("entry_time") and request.data.get("leaving_time")):
        return Response({"error": "You need to add entry time also."}, status=status.HTTP_400_BAD_REQUEST)
    
    attendance = Attendences.objects.filter(worker=worker, date=timezone.localdate()).first()

    if request.method=="PATCH":
        serializer = AttendanceSerializer(attendance, data=request.data)
        if serializer.is_valid():
            attendance = serializer.save()
            return Response({"message": "Entry time marked"}, status=status.HTTP_201_CREATED)
        
    if request.method=="POST":
        if attendance:
            return Response({"error": "Worker entry time is marked already"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            attendance = serializer.save()
            return Response({"message": "Entry time updated"}, status=status.HTTP_201_CREATED)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Leaving time for normal shift
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_leaving_time(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    allowed_fields = {"employer", "worker", "leaving_time"}
    extra_fields = set(request.data.keys()) - allowed_fields

    if extra_fields:
        return Response({"error": f"Unexpected fields sent: {', '.join(extra_fields)}"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    worker_id = request.data.get("worker")
    
    worker = WorkerModel.objects.filter(id = worker_id).first()
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    today = timezone.localdate()

    attendance = Attendences.objects.filter(worker=worker, date=today).first()
    
    if not attendance:
        return Response({"error": "Entry time not marked"}, status=status.HTTP_400_BAD_REQUEST)
    elif attendance.entry_time < request.data.get("leaving_time"):
        return Response({"error": "Leaving time can not be smaller than entry time"})
    
    serializer = AttendanceSerializer(attendance, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Leaving time marked"}, status=status.HTTP_201_CREATED)  
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  
  
# Today's attendance data for worker
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_worker_attendance_data(request, worker_id):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    employer_user = request.user

    worker = WorkerModel.objects.filter(user__username=worker_id).first()
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    employer = employer_user.employer_profile
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    today = timezone.localdate()
    worker_data = Attendences.objects.filter(date=today, worker=worker, employer=employer).first().values()

    return Response({"message": "Worker Today's data fetched successfully", "data": worker_data}, status=status.HTTP_201_CREATED)

# Add Start time for Overtime
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_overtime_start_time(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    allowed_fields = {"employer", "worker", "overtime", "overtime_entry_time"}
    extra_fields = set(request.data.keys()) - allowed_fields

    if extra_fields:
        return Response({"error": f"Unexpected fields sent: {', '.join(extra_fields)}"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    employer = request.user.employer_profile
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker_id = request.data.get("worker")
    worker = WorkerModel.objects.filter(id = worker_id).first()
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
    attendance = Attendences.objects.filter(worker=worker, date=timezone.localdate()).first()
    
    if not attendance:
        return Response({"error": "Today's Work not found"}, status=status.HTTP_400_BAD_REQUEST)
    elif not attendance.leaving_time:
        return Response({"error": "Previous work is not completed"}, status=status.HTTP_400_BAD_REQUEST)
    elif request.data.get("overtime_leaving_time"):
        return Response({"error": "You can't mark leaving time here"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AttendanceSerializer(attendance, data=request.data, partial=True)
    if serializer.is_valid():
        attendance = serializer.save()
        return Response({"message": "Entry time for Overtime marked"}, status=status.HTTP_201_CREATED)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Add leaving time for Overtime
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_overtime_end_time(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile

    allowed_fields = {"employer", "worker", "overtime_leaving_time"}
    extra_fields = set(request.data.keys()) - allowed_fields

    if extra_fields:
        return Response({"error": f"Unexpected fields sent: {', '.join(extra_fields)}"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker_id = request.data.get("worker")
    worker = WorkerModel.objects.filter(id = worker_id).first()
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)

    
    attendance = Attendences.objects.filter(worker=worker, date=date.today()).first()

    overtime_leaving_time = request.data.get("overtime_leaving_time")
    if not attendance.overtime_entry_time:
        return Response({"error": "first you need to add entry time for overtime work"}, status=status.HTTP_404_NOT_FOUND)
    elif attendance.overtime_entry_time > datetime.strptime(overtime_leaving_time, "%H:%M").time():
        return Response({"error": "Leaving time can not be smaller than entry time"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AttendanceSerializer(attendance, data=request.data, partial=True)
    if serializer.is_valid():
        attendance = serializer.save()
        return Response({"message": "Leaving time for Overtime added"}, status=status.HTTP_201_CREATED)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)