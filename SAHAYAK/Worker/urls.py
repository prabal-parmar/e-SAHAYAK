from django.urls import path, include
from Worker import views

urlpatterns = [
    path('salary/<int:month>/<int:year>/', views.fetch_this_month_salary, name="This Month Salary"),
    path('salary/today/', views.todays_wage, name="Today's Wage"),
    path('reports/', views.report_section, name="Report Section"),
    path('profile/', views.get_worker_data, name="Worker Profile"),
    path('recent-work-history/', views.get_recent_work_history, name="Recent Work History"),
    path('stats/', views.get_insights_this_month, name="Worker Insight"),
    path('work-history/', views.get_recent_work_history, name="Recent Work History"),
    path('mark-prev-5-days/', views.mark_safisfied_to_5_days_data, name="Mark Satisfied for prev 5 days attendance"),
    path('pending-response-data/', views.recent_worked_data, name="Pending Responses Data"),
    path('worker-response-to-attendance/', views.update_status, name="Update status of Attendance"),
    path('receiptPDF/<str:id>/', views.get_pdf_data, name="Data for receipt"),
    path('all-reports/', views.get_all_reports_with_status, name="All Reports reported by worker"),
    path('monthly-attendance/', views.get_attendance_by_month, name="Month Attendance of worker"),
    path('filter-attendance-data/', views.get_worker_data_by_date, name="Date wise attendance of worker")
]