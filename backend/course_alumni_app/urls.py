from django.urls import path
from . import views

urlpatterns = [path("students", views.get_students)]
