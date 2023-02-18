import os
import json
import django

os.environ["DJANGO_SETTINGS_MODULE"] = "course_alumni.settings"
django.setup()

from course_alumni_app.models import Student

with open("backend/course_alumni_app/data/students.json", "r") as fh:
    students = json.load(fh)

for i, student_data in enumerate(students):
    if students[i]["fullname"] == "Daniel Raz":
        Student(
            fullname=students[i]["fullname"],
            enrollment_date=students[i]["enrollment_date"],
            profile_pic=students[i]["profile_pic"],
            gender=students[i]["gender"],
        ).save()
