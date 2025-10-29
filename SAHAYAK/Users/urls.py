from django.urls import path, include
from Users import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/login-employer/', views.login_employer, name="Employer Login"),
    path('api/register-employer/', views.signup_employer, name="Employer SignUp"),
    path('api/login-worker/', views.login_worker, name="Worker Login"),
    path('api/register-worker/', views.signup_worker, name="Worker SignUp"),
    path('api/user/change-password/', views.change_password, name="Change Password"),
    path('api/employer/', include('Employer.urls'), name="Employer Routes"),
    path('api/worker/', include('Worker.urls'), name="Worker Routes"),
    path('api/admin/', include('Admin.urls'), name="Admin Routes"),
    path('api/worker/registration-types/', views.worker_registration_types, name="Worker Registration Types"),
    path('api/worker/register-extended/', views.register_worker_extended, name="Register Worker Extended"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]