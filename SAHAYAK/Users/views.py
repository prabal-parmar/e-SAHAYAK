from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import status
from .serializers import EmployerRegisterSerializer, WorkerRegisterSerializer
from uuid import uuid4
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
    serializer = EmployerRegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Employer Register Successfully"}, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    serializer = WorkerRegisterSerializer(data = request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Worker Register Successfully"}, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
