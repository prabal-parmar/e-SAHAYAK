from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .models import Attendences, HourWage, ReportWorkerModel
from Users.models import WorkerModel, EmployerModel
from datetime import datetime, timedelta, date
from decimal import Decimal
from .serializers import ReportWorkerSerializer
from Users.serializers import WorkerRegisterSerializer
from django.utils import timezone
from calendar import monthrange
from Employer.models import WorkersWorkModel
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

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def get_worker_data(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker_profile = WorkerModel.objects.filter(user=worker).first()
    if request.method=="GET":
        data = {
        "first_name": worker_profile.user.first_name,
        "last_name": worker_profile.user.last_name,
        "username": worker_profile.user.username,
        "email": worker_profile.user.email,
        "address": worker_profile.address,
        "contact_number": worker_profile.contact_number,
        "gender": worker_profile.gender,
        "skill": worker_profile.skill
        }
        # print(employer_profile)
        return Response({"message":"Worker data sent", "worker": data}, status=status.HTTP_200_OK)
    
    if request.method=="PATCH":
        data = {
        "first_name": request.data.get("first_name"),
        "last_name": request.data.get("last_name"),
        "address": request.data.get("address"),
        "contact_number": request.data.get("contact_number"),
        "gender": request.data.get("gender"),
        "skill": request.data.get("skill")
        }
        serializer = WorkerRegisterSerializer(worker_profile, data=data, partial=True)
        if serializer.is_valid():
            print(serializer)
            serializer.save()
            return Response({"message": "Worker Profile Updated Successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Error in updating Worker profile"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_work_history(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker = request.user.worker_profile
    today = timezone.now().date()
    start_date = today - timedelta(days=5)
    attendances = Attendences.objects.filter(worker=worker, date__range=[start_date, today])

    data = []
    hourly_wage = HourWage.objects.first().hourly_wage
    for index,attendance in enumerate(attendances, start=1):
        employer = attendance.employer
        employer_profile = EmployerModel.objects.filter(id=employer.id).first()

        org_name = employer_profile.org_name
        temp = {
            "id": index,
            "organizationName": org_name,
            "date": attendance.date,
            "wages": Decimal(attendance.total_time) * hourly_wage,
            "satisfaction": attendance.worker_response,
        }
        data.append(temp)
    
    return Response({"message": "Recent Work for 5 days sent.", "data": data}, status=status.HTTP_200_OK)

# this month total salary
def this_month_salary(worker):
    if not worker:
        return -1
    
    today = date.today()
    month = today.month
    year = today.year

    worker_work = WorkersWorkModel.objects.filter(worker=worker, date__year=year, date__month=month).all().values()

    amount = 0
    for work in worker_work:
        amount += work["amount"]
    return amount

# Total present and absent
def present_absent(worker):
    if not worker:
        return -1, -1
    
    today = date.today()
    month = today.month
    year = today.year

    working_days = WorkersWorkModel.objects.filter(worker=worker, date__year=year, date__month=month).all().count()
    todays_date = date.today().day

    leave_days = int(todays_date) - int(working_days)
    return working_days, leave_days

# week-wise earning
def week_wise_earning(worker):
    today = date.today()
    year, month = today.year, today.month

    days_in_month = monthrange(year, month)[1]
    month_end = date(year, month, days_in_month)

    weeks = []
    for day in range(1, days_in_month, 7):
        start = date(year, month, day)
        end = min(start + timedelta(days=6), month_end)
        weeks.append((start, end))

    data = []
    for index, (start, end) in enumerate(weeks, start=1):
        worker_week = WorkersWorkModel.objects.filter(date__range=[start, end], worker=worker).all().values()
        total_amount = 0
        for day in worker_week:
            total_amount += day["amount"]
        
        temp = {
            "week": f"Week {index}",
            "earnings": total_amount
        }
        data.append(temp)
    
    return data

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_insights_this_month(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker = request.user.worker_profile
    total_salary = this_month_salary(worker)
    working_days, leave_days = present_absent(worker)
    earnings_week_wise = week_wise_earning(worker)
    # print(earnings_week_wise)
    data = {
        "this_month_salary": total_salary,
        "working_days": working_days,
        "leave_days": leave_days,
        "monthlyAnalysis": earnings_week_wise
    }
    print(data)
    return Response({"message": "Worker insight sent.", "data": data}, status=status.HTTP_200_OK)