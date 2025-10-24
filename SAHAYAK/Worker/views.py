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
import math
from django.db.models import F
from Employer.models import WorkersWorkModel
# Create your views here.


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

    wage = HourWage.objects.last()
    overtime_wage = wage.overtime_wage if wage else 70
    hour_wage = wage.hourly_wage if wage else 60

    total_salary = 0
    extra_salary = 0
    for attendance in attendances:
        total_salary += Decimal(attendance.total_time)*hour_wage
        extra_salary += Decimal(attendance.extra_time)*overtime_wage

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

    wage = HourWage.objects.last()
    overtime_wage = wage.overtime_wage if wage else 70
    hour_wage = wage.hourly_wage if wage else 60

    total_salary = 0
    extra_salary = 0
    for attendance in attendances:
        total_salary += Decimal(attendance.total_time)*hour_wage
        extra_salary += Decimal(attendance.extra_time)*overtime_wage
    
    return Response({"message": "Total salary calculated", 
                     "total_salary": math.floor(total_salary), 
                     "extra_salary": math.floor(extra_salary)}, status=status.HTTP_200_OK)
    

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
    today = timezone.now().date() + timedelta(days=1)
    start_date = today - timedelta(days=6)
    attendances = WorkersWorkModel.objects.filter(worker=worker, attendance__date__range=[start_date, today]).all().values(emp=F("attendance__employer"),
                                                                                                                           d=F("attendance__date"),
                                                                                                                           a=F("amount"),
                                                                                                                           satisfaction=F("attendance__worker_response"))

    data = []
    wage = HourWage.objects.last()
    hour_wage = wage.hourly_wage if wage else 60
    overtime_wage = wage.overtime_wage if wage else 70

    for index,attendance in enumerate(attendances, start=1):
        employer = attendance["emp"]
        employer_profile = EmployerModel.objects.filter(id=employer).first()

        org_name = employer_profile.org_name
        temp = {
            "id": index,
            "organizationName": org_name,
            "date": attendance["d"],
            "wages": math.floor(attendance["a"]),
            "satisfaction": attendance["satisfaction"],
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
    return math.floor(amount)

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
            "earnings": math.floor(total_amount)
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
        "this_month_salary": math.floor(total_salary),
        "working_days": working_days,
        "leave_days": leave_days,
        "monthlyAnalysis": earnings_week_wise
    }
    print(data)
    return Response({"message": "Worker insight sent.", "data": data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_safisfied_to_5_days_data(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker = request.user.worker_profile
    y = request.data.get("year")
    m = request.data.get("month")
    d = request.data.get("date")

    prev_5_dates = date(y, m, d) - timedelta(days=5)
    Attendences.objects.filter(date__lt=prev_5_dates, worker=worker, worker_response="pending").update(worker_response="satisfied")
    return Response({"message": "Attendance status for worker response updated."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_worked_data(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker = request.user.worker_profile
    today = timezone.now().date() + timedelta(days=1)
    start_date = today - timedelta(days=6)
    attendances = WorkersWorkModel.objects.filter(worker=worker, attendance__date__range=[start_date, today]).all().values(index=F("attendance__work_id"),
                                                                                                                           emp=F("employer"),
                                                                                                                           d=F("attendance__date"),
                                                                                                                           a=F("amount"),
                                                                                                                           status=F("attendance__worker_response"),
                                                                                                                           startTime=F("attendance__entry_time"),
                                                                                                                           endTime=F("attendance__leaving_time"))

    data = []


    for index,attendance in enumerate(attendances, start=1):
        employer = attendance["emp"]
        employer_profile = EmployerModel.objects.filter(id=employer).first()

        org_name = employer_profile.org_name
        temp = {
            "id": attendance["index"],
            "organizationName": org_name,
            "date": attendance["d"],
            "wages": math.floor(attendance["a"]),
            "status": attendance["status"],
            "startTime": attendance["startTime"],
            "endTime": attendance["endTime"]
        }
        data.append(temp)
    
    return Response({"message": "Recent Work for 5 days sent.", "data": data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_status(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)

    worker = request.user.worker_profile
    attendance_id = request.data.get("id")
    response = request.data.get("status")
    attendance = Attendences.objects.filter(work_id=attendance_id).first()

    if attendance.worker_response!="pending":
        return Response({"error": "Already responded"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        attendance.worker_response = response
        attendance.save()

        if response == "report":
            report = ReportWorkerModel.objects.filter(worker=worker, attendance=attendance).first()

            if report:
                return Response({"error": "Report already submitted."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                reason = request.data.get("reason")
                message = request.data.get("message")
                ReportWorkerModel.objects.create(employer=attendance.employer, 
                                                 worker=worker, 
                                                 attendance=attendance, 
                                                 reason=reason, 
                                                 message=message)
                return Response({"message": "Report submitted against Employer"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Status updated successfuly."}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pdf_data(request, id):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)

    worker = request.user.worker_profile
    attendance = Attendences.objects.filter(work_id=id).first()
    work = WorkersWorkModel.objects.filter(attendance=attendance, worker=worker).first()

    wage = HourWage.objects.last()
    hour_wage = wage.hourly_wage if wage else 60

    data = {
        "worker_id": attendance.worker.user.username,
        "org_name": attendance.employer.org_name,
        "work_id": attendance.work_id,
        "date": attendance.date,
        "shift": attendance.shift,
        "entry_time": attendance.entry_time,
        "leaving_time": attendance.leaving_time,
        "wage_per_hour": hour_wage,
        "amount": math.floor(work.amount)
    }

    return Response({"message": "Data for receipt pdf sent.", "data": data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_reports_with_status(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)

    worker = request.user.worker_profile
    all_reports = ReportWorkerModel.objects.filter(worker=worker).all().order_by("date")

    data = []
    for index, report in enumerate(all_reports, start=1):
        description = "No message added." if not report.message else report.message
        temp = {
            "id": index,
            "organizationName": report.employer.org_name,
            "date": report.date,
            "reason": report.reason,
            "description": description,
            "status": report.status
        }
        data.append(temp)

    return Response({"message": "All reports reported by worker sent", "data": data}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_attendance_by_month(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker = request.user.worker_profile
    
    if request.method=="GET":
        month = int(request.GET.get("month"))
        year = int(request.GET.get("year"))
        attendances = WorkersWorkModel.objects.filter(attendance__date__month=month, attendance__date__year=year, worker=worker).all().values(d=F("attendance__date"),
                                                                                                                               o=F("attendance__overtime"))
        
        data = []
        for attendance in attendances:
            if attendance["o"]:
                temp = {
                    "status": "overtime",
                    "date": attendance["d"].strftime("%Y-%m-%d")
                }
            else:
                temp = {
                    "status": "present",
                    "date": attendance["d"].strftime("%Y-%m-%d")
                }
            data.append(temp)
        print(data)
        return Response({"message": "Month data sent", "data": data}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_worker_data_by_date(request):
    if request.user.role!="worker":
        return Response({"error": "Worker have access to their profile"}, status=status.HTTP_400_BAD_REQUEST)
    
    worker = request.user
    if not worker:
        return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
    
    worker = request.user.worker_profile

    if request.method=="GET":
        d = request.GET.get("date").split("-")
        year = int(d[0])
        month = int(d[1])
        day = int(d[2])

        # print(day, month, year)
        if not WorkersWorkModel.objects.filter(worker=worker, attendance__date__day=day, attendance__date__month=month, attendance__date__year=year).values().first():
            return Response({"message": "Attendance Data for this day not found", "data": {}}, status=status.HTTP_404_NOT_FOUND)
        
        attendance = WorkersWorkModel.objects.filter(worker=worker, attendance__date__day=day, attendance__date__month=month, attendance__date__year=year).all().values(organizationName=F("employer__org_name"),
                                                                                                                                                                        attend_id=F("attendance__id"),
                                                                                                                                                                        Shift=F("attendance__shift"),
                                                                                                                                                                        entryTime=F("attendance__entry_time"),
                                                                                                                                                                        leavingTime=F("attendance__leaving_time"),
                                                                                                                                                                        overtimeEntryTime=F("attendance__overtime_entry_time"),
                                                                                                                                                                        overtimeLeavingTime=F("attendance__overtime_leaving_time"),
                                                                                                                                                                        totalAmount=F("amount"))
        attendance = list(attendance)
        wage = HourWage.objects.last()
        hour_wage = int(wage.hourly_wage) if wage else 60
        overtime_wage = int(wage.overtime_wage) if wage else 70
        attend = Attendences.objects.filter(id=attendance[0]["attend_id"]).first()
        # print(attendance)
        data = {
            "organizationName": attendance[0]["organizationName"],
            "earning": math.floor(attend.total_time * hour_wage),
            "Shift": attendance[0]["Shift"],
            "entryTime": attendance[0]["entryTime"],
            "leavingTime": attendance[0]["leavingTime"],
            "overtimeEntryTime": attendance[0]["overtimeEntryTime"],
            "overtimeLeavingTime": attendance[0]["overtimeLeavingTime"],
            "overtimeEarning": math.floor(attend.extra_time * overtime_wage),
            "totalAmount": attendance[0]["totalAmount"]
        }
        return Response({"message": "Attendance Data sent", "data": data}, status=status.HTTP_200_OK)
