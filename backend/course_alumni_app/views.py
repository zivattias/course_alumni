from django.shortcuts import render, get_list_or_404
from course_alumni_app.models import Student
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from course_alumni_app.serializers import StudentSerializer


@api_view(["GET"])
def get_students(request: Request):
    students = Student.objects.all()
    if "fullname" in request.query_params:
        students = students.filter(fullname__iexact=request.query_params["fullname"])
    if "firstname" in request.query_params:
        students = students.filter(
            fullname__icontains=request.query_params["firstname"]
        )
    if "lastname" in request.query_params:
        students = students.filter(fullname__icontains=request.query_params["lastname"])
    # Add gender to Student model
