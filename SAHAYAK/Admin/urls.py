from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('all-employers/', views.all_employers, name='all_employers'),
    path('all-workers/', views.all_workers, name='all_workers'),
    path('all-pending-reports/', views.send_all_pending_reports, name='all_pending_reports'),
    path('all-resolved-reports/', views.send_all_resolved_reports, name='all_resolved_reports'),
    path('get-employer-data/<str:username>/', views.get_employer_data, name='get_employer_data'),
    path('get-worker-data/<str:username>/', views.get_worker_data, name='get_worker_data'),
    path('resolve-complaint/', views.resolve_complaint, name='resolve_complaint'),
    path('filter-worker-by-employer-date/<int:employer_id>/', views.filter_worker_by_employer_date, name='filter_worker_by_employer_date'),
    path('filter-worker-work-by-date/<int:worker_id>/', views.filter_worker_work_by_date, name='filter_worker_work_by_date'),
    path('hour-wage/', views.wage_authority_for_admin, name="Hourly Wage")
]