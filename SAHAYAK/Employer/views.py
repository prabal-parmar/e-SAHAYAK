from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from Users.models import CustomUser, WorkerModel, EmployerModel
from Worker.models import Attendences, ReportWorkerModel
from .models import WorkersWorkModel, ReportEmployerModel
from datetime import date, datetime
from django.utils import timezone
from Worker.serializers import AttendanceSerializer
from .serializers import ReportEmployerSerializer
from django.db.models import F
from Users.serializers import EmployerRegisterSerializer
# Create your views here.


# All workers working today under employer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_workers_worked_on_date(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile

    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    date = request.data.get("date")
    all_workers_working_today = WorkersWorkModel.objects.filter(employer=employer, date=date).all().values()

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

    worker = CustomUser.objects.filter(username = worker_id).first().worker_profile
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.data.get("leaving_time"):
        return Response({"error": "You can only add entry time here"}, status=status.HTTP_400_BAD_REQUEST)
    
    if (not request.data.get("entry_time") and request.data.get("leaving_time")):
        return Response({"error": "You need to add entry time also."}, status=status.HTTP_400_BAD_REQUEST)

    attendance = Attendences.objects.filter(worker=worker, date=timezone.localdate()).first()

    if request.method=="PATCH":
        data = request.data.copy()
        data["worker"] = worker.id
        data["employer"] = employer
        serializer = AttendanceSerializer(attendance, data=data)
        if serializer.is_valid():
            attendance = serializer.save()
            return Response({"message": "Entry time marked"}, status=status.HTTP_201_CREATED)
        
    if request.method=="POST":
        if attendance:
            return Response({"error": "Worker entry time is marked already"}, status=status.HTTP_400_BAD_REQUEST)
        data = request.data.copy()
        data["worker"] = worker.id
        data["employer"] = employer.id
        serializer = AttendanceSerializer(data=data)
        if serializer.is_valid():
            attendance = serializer.save()
            return Response({"message": "Entry time updated"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Leaving time for normal shift
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_leaving_time(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer have access to find all workers"}, status=status.HTTP_401_UNAUTHORIZED)
    
    employer = request.user.employer_profile
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    allowed_fields = {"worker", "leaving_time", "date", "description"}
    extra_fields = set(request.data.keys()) - allowed_fields

    if extra_fields:
        return Response({"error": f"Unexpected fields sent: {', '.join(extra_fields)}"}, 
                        status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    
    worker_id = request.data.get("worker")
    
    worker = CustomUser.objects.filter(username = worker_id).first().worker_profile
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    today = request.data.get("date") or timezone.localdate()

    attendance = Attendences.objects.filter(worker=worker, employer=employer, date=today).first()
    leaving_time_str = request.data.get("leaving_time")
    leaving_time = datetime.strptime(leaving_time_str, "%H:%M").time()
    if not attendance:
        return Response({"error": "Entry time not marked"}, status=status.HTTP_400_BAD_REQUEST)
    # elif attendance.entry_time < leaving_time:
    #     return Response({"error": "Leaving time can not be smaller than entry time"})
    
    data = request.data.copy()
    data["worker"] = worker.id
    data["employer"] = employer.id
    serializer = AttendanceSerializer(attendance, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Leaving time marked"}, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
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
                        status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    
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
                        status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    
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

# Report Section for Employer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reports_by_worker(request):

    employer = request.user.employer_profile
    if not employer:
        return Response({"error": "You are not loggedIn"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user.role != "employer":
        return Response({"error": "You are not a Employer"}, status=status.HTTP_400_BAD_REQUEST)
    
    all_reports = ReportWorkerModel.objects.filter(employer=employer).all().values()

    return Response({"message": "All Reports by Worker fetched.", "reports": all_reports}, status=status.HTTP_200_OK)

# Report by Employer
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def report_by_employer(request):

    if request.user.role!="employer":
        return Response({"error": "Only Employer can see the reports"}, status=status.HTTP_400_BAD_REQUEST)
    
    employer = request.user
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method=="GET":
        all_reports_by_employer = ReportEmployerModel.objects.filter(employer=employer).all().values()

        return Response({"message": "All reports by employer fetched successfully.", 
                         "reports": all_reports_by_employer}, status=status.HTTP_200_OK)
    
    if request.method=="POST":
        data = request.data.copy()
        data["employer"] = employer.employer_profile.id
        serializer = ReportEmployerSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Report submitted successfully."}, status=status.HTTP_201_CREATED)
        return Response({"error": "Some unexpected error occured."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_workers(request):

    if request.user.role!="employer":
        return Response({"error": "Only Employer can see the reports"}, status=status.HTTP_400_BAD_REQUEST)
    
    employer = request.user
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    all_workers = CustomUser.objects.filter(role="worker").values("username")

    return Response({"message": "All workers username sent.", "workers": all_workers}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_workers_working_now(request):
    if request.user.role != "employer":
        return Response({"error": "Only Employer can see the reports"}, status=status.HTTP_400_BAD_REQUEST)
    
    employer = request.user.employer_profile
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    all_workers_working = WorkerModel.objects.filter(attendances__date=timezone.localdate(),
                                                     attendances__employer=employer).values(username=F("user__username"),
                                                                                            shift=F("attendances__shift"), 
                                                                                            entry_time=F("attendances__entry_time"), 
                                                                                            date=F("attendances__date"),
                                                                                            leaving_time=F("attendances__leaving_time"))

    workers = []
    for row in all_workers_working:
        workers.append({
            "username": row["username"],
            "shift": row["shift"],
            "entry_time": str(row["entry_time"]) if row["entry_time"] else None,
            "date": str(row["date"]) if row["date"] else None,
            "leaving_time": str(row["leaving_time"]) if row["leaving_time"] else None,
        })

    # print(workers)
    return Response({"message": "All username of workers working sent.", 
                     "workers": all_workers_working}, status=status.HTTP_200_OK)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def get_employer_data(request):
    if request.user.role!="employer":
        return Response({"error": "Only Employer have this right."}, status=status.HTTP_400_BAD_REQUEST)
    
    employer = request.user
    if not employer:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    employer_profile = EmployerModel.objects.filter(user=employer).first()
    if request.method=="GET":
        data = {
        "username": employer_profile.user.username,
        "org_name": employer_profile.org_name,
        "email": employer_profile.user.email,
        "location": employer_profile.location,
        "contact_number": employer_profile.contact_number
        }
        # print(employer_profile)
        return Response({"message":"Employer data sent", "employer": data}, status=status.HTTP_200_OK)
    
    if request.method=="PATCH":
        serializer = EmployerRegisterSerializer(employer_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile Updated Successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Error in updating Employer profile"}, status=status.HTTP_400_BAD_REQUEST)
    
