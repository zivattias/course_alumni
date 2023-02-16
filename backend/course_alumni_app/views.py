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
    if "gender" in request.query_params:
        students = students.filter(gender=request.query_params["gender"])
    if "enrollment_date" in request.query_params:
        students = students.filter(
            enrollment_date=request.query_params["enrollment_date"]
        )

    if not students:
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)
