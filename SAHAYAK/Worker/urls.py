from django.urls import path, include
from Worker import views

urlpatterns = [
    path('salary/<int:month>/<int:year>/', views.fetch_this_month_salary, name="This Month Salary"),
    path('salary/today/', views.todays_wage, name="Today's Wage"),
    path('reports/', views.report_section, name="Report Section"),
    path('profile/', views.get_worker_data, name="Worker Profile")
]