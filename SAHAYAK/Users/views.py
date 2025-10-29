from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import status
from .serializers import EmployerRegisterSerializer, WorkerRegisterSerializer, EChowkSerializer, WorkerExtendedRegistrationSerializer
from .models import EChowk, WorkerExtendedRegistration
from uuid import uuid4
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, EmployerModel
# Create your views here.

User = get_user_model()

@api_view(['POST'])
def login_employer(request):
    employer_id = request.data.get("username")
    password = request.data.get("password")

    employer = authenticate(username = employer_id, password = password)

    if employer is not None and employer.role == "employer":
        refresh = RefreshToken.for_user(employer)
        return Response(
            {
                "role": "employer",
                "message": "Employer Login Successful",
                "employer": {
                    "username": employer.username
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            },
            status = status.HTTP_200_OK
        )
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def signup_employer(request):

    username = request.data.get("username")
    email = request.data.get("email")
    contact_number = request.data.get("contact_number")

    check_username = CustomUser.objects.filter(username=username).first()
    if check_username:
        return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
    
    check_email = CustomUser.objects.filter(email=email).first()
    if check_email:
        return Response({"error": "Email already registered. Please Login!"}, status=status.HTTP_400_BAD_REQUEST)
    
    check_number = EmployerModel.objects.filter(contact_number=contact_number).first()
    if check_number:
        return Response({"error": "Mobile number already registered. Try another!"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = EmployerRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Employer Register Successfully"}, status=status.HTTP_201_CREATED)
    else:
        # print(serializer.errors)
        return Response({"error":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_worker(request):
    worker_id = request.data.get("username")
    password = request.data.get("password")

    worker = authenticate(username=worker_id, password=password)

    if worker is not None:
        refresh = RefreshToken.for_user(worker)
        return Response(
            {
                "role": "worker",
                "message": "Worker Login Successful",
                "employer": {
                    "username": worker.username,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            },
            status = status.HTTP_200_OK
        )
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def signup_worker(request):

    username = request.data.get("username")
    contact_number = request.data.get("contact_number")

    check_username = CustomUser.objects.filter(username=username).first()
    if check_username:
        return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
    
    check_number = EmployerModel.objects.filter(contact_number=contact_number).first()
    if check_number:
        return Response({"error": "Mobile number already registered. Try another!"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = WorkerRegisterSerializer(data = request.data)
    # print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Worker Register Successfully"}, status=status.HTTP_201_CREATED)
    else:
        # print(serializer.errors)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
def worker_registration_types(request):
    types = [
        {
            "key": "e_chowk",
            "title": "e-CHOWK Registration",
            "required_fields": [
                {"name": "chowk_gp_code", "label": "Chowk/Ward/GP code", "type": "string", "required": True},
                {"name": "chowk_name", "label": "Chowk Name", "type": "string", "required": True},
                {"name": "chowk_address", "label": "Chowk Address (complete demography)", "type": "string", "required": True},
                {"name": "gkyc_available", "label": "G-KYC of Chowk available?", "type": "boolean", "required": False},
                {"name": "e_chowk_type", "label": "eChowk Type", "type": "string", "required": False},
                {"name": "working_sector", "label": "Working sector (Niyojan)", "type": "string", "required": False},
                {"name": "e_chowk_email", "label": "eChowk Email (if any)", "type": "string", "required": False}
            ]
        },
        {
            "key": "samagra",
            "title": "Shramik Samagra [S]",
            "required_fields": [
                {"name": "samagra_id", "label": "Samagra ID", "type": "string", "required": True},
                {"name": "family_head", "label": "Family Head", "type": "string", "required": False}
            ]
        },
        {
            "key": "esic",
            "title": "ESIS/ESIC",
            "required_fields": [
                {"name": "esic_id", "label": "ESIC ID", "type": "string", "required": True},
                {"name": "esic_branch", "label": "ESIC Branch", "type": "string", "required": False}
            ]
        },
        {
            "key": "health_card",
            "title": "Shramik Health Card [H]",
            "required_fields": [
                {"name": "health_card_no", "label": "Health Card Number", "type": "string", "required": True},
                {"name": "blood_group", "label": "Blood Group", "type": "string", "required": False}
            ]
        },
        {
            "key": "basic",
            "title": "Basic Registration",
            "required_fields": [
                {"name": "first_name", "label": "First Name", "type": "string", "required": True},
                {"name": "last_name", "label": "Last Name", "type": "string", "required": True},
                {"name": "contact_number", "label": "Mobile", "type": "string", "required": True}
            ]
        }
    ]
    return Response({"types": types}, status=status.HTTP_200_OK)

@api_view(["POST"])
def register_worker_extended(request):
    reg_type = request.data.get("registration_type")
    if not reg_type:
        return Response({"error": "registration_type is required"}, status=status.HTTP_400_BAD_REQUEST)

    username = request.data.get("username")

    if reg_type == "e_chowk":
        echowk_payload = {
            "chowk_name": request.data.get("chowk_name"),
            "chowk_code": request.data.get("chowk_gp_code"),
            "chowk_address": request.data.get("chowk_address"),
            "pincode": request.data.get("pincode"),
            "chowk_type": request.data.get("e_chowk_type") or "other",
            "chowk_email": request.data.get("e_chowk_email"),
        }
        e_serializer = EChowkSerializer(data=echowk_payload)
        if e_serializer.is_valid():
            echowk = e_serializer.save()
        else:
            return Response({"error": e_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    ext_payload = {
        "username": username or "",
        "registration_type": reg_type,
        "data": {k: v for k, v in request.data.items()},
    }
    wext = WorkerExtendedRegistrationSerializer(data=ext_payload)
    if wext.is_valid():
        wext.save()
    else:
        return Response({"error": wext.errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Extended registration saved."}, status=status.HTTP_201_CREATED)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    if not user:
        print("error occured")
        return Response({"error": "You need to login first."}, status=status.HTTP_401_UNAUTHORIZED)
    old_password = request.data.get("oldPassword")
    new_password = request.data.get("newPassword")

    if not user.check_password(old_password):
        print("again occured")
        return Response({"error": "old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully."}, status=status.HTTP_201_CREATED)

