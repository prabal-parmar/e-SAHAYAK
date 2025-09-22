from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from Users.models import CustomUser, WorkerModel
from .models import ConnectionRequest, Connections
from Worker.models import Attendences
from datetime import date, datetime
from django.utils import timezone
# Create your views here.


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_worker(request, worker_id):
    if request.user.role != "employer":
        return Response({"error": "Employer have right to send request"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile

    try:
        worker_user = CustomUser.objects.get(username=worker_id)
        worker = worker_user.worker_profile
    except Exception as e:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if worker_user.role != "worker":
        return Response({"error": "You can only send request to a worker"}, status=status.HTTP_400_BAD_REQUEST)
    
    if Connections.objects.filter(employer=employer, worker=worker).exists():
        return Response({"error": "Worker already added"}, status=status.HTTP_400_BAD_REQUEST)
    
    if Connections.objects.filter(worker=worker).exists():
        return Response({"error": "Worker already added to another Employer"}, status=status.HTTP_400_BAD_REQUEST)
    
    if ConnectionRequest.objects.filter(sender=employer, receiver=worker).exists():
        return Response({"error": "Request already sent"}, status=status.HTTP_400_BAD_REQUEST)
    
    req = ConnectionRequest.objects.create(sender=employer, receiver=worker)
    return Response({"message": "Connection Request sent", "id": req.id}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_workers(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile

    all_workers = WorkerModel.objects.filter(employer=employer).all().values()

    return Response({"message": "All Worker Fetched", "workers": all_workers}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_entry_time(request, worker_id):

    worker = CustomUser.objects.filter(username = worker_id).first()
    worker = worker.worker_profile

    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    employer = request.user.employer_profile
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    connection = Connections.objects.filter(employer = employer, worker=worker)
    if not connection:
        return Response({"message": "Worker is not your Employee"}, status=status.HTTP_401_UNAUTHORIZED)
    
    attendance = Attendences.objects.filter(worker=worker, date=date.today())
    if attendance:
        attendance.delete()
        return Response({"message": "Attendance unmarked"}, status=status.HTTP_200_OK)
    
    Attendences.objects.create(worker=worker)
    todays_attendance = Attendences.objects.filter(worker=worker, date=date.today()).values().first()
    return Response({"message": "Attendance marked successfully", "todays_attendance": todays_attendance}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_leaving_time(request, worker_id):
    worker = CustomUser.objects.filter(username = worker_id).first()
    worker = worker.worker_profile

    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    attendance = Attendences.objects.filter(worker=worker, date=date.today()).first()

    if not attendance:
        return Response({"error": "Entry time not marked"}, status=status.HTTP_400_BAD_REQUEST)
    
    if attendance.leaving_time:
        attendance.leaving_time = None
        attendance.save()
        return Response({"message": "Leaving Time Removed from Attendance"}, status=status.HTTP_200_OK)
    employer = request.user.employer_profile
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    connection = Connections.objects.filter(employer = employer, worker=worker)
    if not connection:
        return Response({"message": "Worker is not your Employee"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        attendance.leaving_time = timezone.now()
        attendance.save()

        return Response({"message": "Leaving time added",
                         "tota_time": attendance.total_time,
                         "extra_time": attendance.extra_time}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": "Some error occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
