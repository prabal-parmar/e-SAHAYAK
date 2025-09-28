from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .models import Attendences, HourWage
from datetime import datetime
from decimal import Decimal
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
    


