from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from Employer.models import Connections, ConnectionRequest
# Create your views here.

def worker_home(request):
    return HttpResponse("Worker Home")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def connection_response(request, id, res):

    if request.user.role != "worker":
        return Response({"error": "Only Worker have right to accept request from employer"}, status=status.HTTP_403_FORBIDDEN)
    
    worker = request.user.worker_profile

    connection_request = ConnectionRequest.objects.filter(id = id, receiver=worker, status="pending").first()

    if not connection_request:
        return Response({"error": "No request from any employer"}, status=status.HTTP_404_NOT_FOUND)
    
    if res == "yes":
        connection_request.status = "accepted"
        connection_request.save()
        worker.employer=connection_request.sender
        worker.save()
        try:
            employer = connection_request.sender
            Connections.objects.create(employer=employer, worker=worker)
            return Response({"message": "Worker added to Employer"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Connection already stablished"}, status=status.HTTP_400_BAD_REQUEST)
    elif res == "no":
        connection_request.status = "declined"
        connection_request.save()
        return Response({"message": "Connection declined by worker"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid response by worker"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_requests(request):
    if request.user.role != "worker":
        return Response({"error": "Worker have right to see all requests from Employer"}, status=status.HTTP_403_FORBIDDEN)
    
    worker = request.user.worker_profile

    all_requests = ConnectionRequest.objects.filter(receiver=worker, status="pending").all().values()

    return Response({"message": "All Connection Requests fetched successfully", "all_requests": all_requests}, status=status.HTTP_200_OK)


