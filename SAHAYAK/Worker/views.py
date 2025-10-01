from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .models import Attendences, HourWage, ReportWorkerModel
from Users.models import WorkerModel, EmployerModel
from datetime import datetime
from decimal import Decimal
from .serializers import ReportWorkerSerializer
# Create your views here.

hour_pay = HourWage.objects.first().hourly_wage
extra_hour_pay = HourWage.objects.first().overtime_wage

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def todays_wage(request):

    if request.user.role != "worker":
        return Response({"error": "Worker have right to see all requests from Employer"}, status=status.HTTP_403_FORBIDDEN)
    
    worker_user = request.user
    if worker_user.role != "worker":
        return Response({"error": "Not a worker"}, status=status.HTTP_403_FORBIDDEN)
    
    worker = worker_user.worker_profile
    if not worker:
        return Response({"error": "Unable to fetch worker"}, status=status.HTTP_403_FORBIDDEN)
    
    today_date = datetime.today().now().date()
    attendances = Attendences.objects.filter(worker=worker, date=today_date).all()

    total_salary = 0
    extra_salary = 0
    for attendance in attendances:
        total_salary += Decimal(attendance.total_time)*hour_pay
        extra_salary += Decimal(attendance.extra_time)*extra_hour_pay

    return Response({"message": "Todays salary calculated", 
                     "total_salary": total_salary,
                     "extra_salary": extra_salary}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_this_month_salary(request, month, year):

    worker_user = request.user
    if worker_user.role != "worker":
        return Response({"error": "Not a worker"}, status=status.HTTP_403_FORBIDDEN)
    
    worker = worker_user.worker_profile
    if not worker:
        return Response({"error": "Unable to fetch worker"}, status=status.HTTP_403_FORBIDDEN)
    
    
    attendances = Attendences.objects.filter(worker=worker, date__month=month, date__year=year).all()

    total_salary = 0
    extra_salary = 0
    for attendance in attendances:
        total_salary += Decimal(attendance.total_time)*hour_pay
        extra_salary += Decimal(attendance.extra_time)*extra_hour_pay
    
    return Response({"message": "Total salary calculated", 
                     "total_salary": total_salary, 
                     "extra_salary": extra_salary}, status=status.HTTP_200_OK)
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def report_section(request):

    worker = request.user
    if not worker:
        return Response({"error": "Worker not found."}, status=status.HTTP_404_NOT_FOUND)
    
    if worker.role != "worker":
        return Response({"error": "Only worker have right to see and send reports to Employer."}, status=status.HTTP_404_NOT_FOUND)
    
    # GET Route
    if request.method=="GET":
        worker = worker.worker_profile
        all_reports = ReportWorkerModel.objects.filter(worker=worker).all().values()

        return Response({"message": "All reports fetched.", "reports": all_reports}, status=status.HTTP_200_OK)
    
    #POST Route
    if request.method=="POST":
        employer_id = request.data.get("employer")
        if not employer_id:
            return Response({"error": "Needs Employer Id for submitting report"}, status=status.HTTP_404_NOT_FOUND)
        
        employer = EmployerModel.objects.filter(id=employer_id).first()
        if not employer:
            return Response({"error": "Employer not found."}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()

        data["worker"] = worker.worker_profile.id
        serializer = ReportWorkerSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Report Submitted successfuly"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

