from django.urls import path, include
from Worker import views

urlpatterns = [
    path('home/', views.worker_home, name="Worker Home"),
    path('connection/response/<int:id>/<str:res>/', views.connection_response, name="Connection Response from Worker"),
    path('connection/get-requests/', views.get_all_requests, name="Get All Requests of Connection")
]