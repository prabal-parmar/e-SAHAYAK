from django.urls import path, include
from Users import views

urlpatterns = [
    path('api/login-employer/', views.login_employer, name="Employer Login"),
    path('api/register-employer/', views.signup_employer, name="Employer SignUp"),
    path('api/login-worker/', views.login_worker, name="Worker Login"),
    path('api/register-worker/', views.signup_worker, name="Worker SignUp"),
    path('api/employer/', include('Employer.urls'), name="Employer Routes"),
    path('api/worker/', include('Worker.urls'), name="Worker Routes"),
]