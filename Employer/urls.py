from django.urls import path, include
from Employer import views

urlpatterns = [
    path('connection/add-request/<str:worker_id>/', views.add_worker, name="Adding Worker"),
    path('all-workers/', views.get_all_workers, name="All Workers of Employer"),
    path('mark-entry-time/<str:worker_id>/', views.mark_entry_time, name="Mark Entry Time"),
    path('mark-leaving-time/<str:worker_id>/', views.mark_leaving_time, name="Mark Leaving Time"),

]