from django.urls import path, include
from Employer import views

urlpatterns = [
    path('work/all-workers/', views.get_all_workers_working_today, name="All Workers of Employer"),
    path('work/mark-entry-time/', views.mark_entry_time, name="Mark Entry Time"),
    path('work/mark-leaving-time/', views.mark_leaving_time, name="Mark Leaving Time"),
    path('work/mark-overtime-start-time/', views.add_overtime_start_time, name="Mark Overtime Start Time"),
    path('work/mark-overtime-end-time/', views.add_overtime_end_time, name="Mark Overtime End Time"),
    path('worker-data/<str:worker_id>/', views.fetch_worker_attendance_data, name="Worker Data"),
    path('worker-reports/', views.get_reports_by_worker, name="Reported by Worker"),
    path('reports/', views.report_by_employer, name="Reports by User")
]