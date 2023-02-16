from django.db import models


class Student(models.Model):
    fullname = models.CharField(
        max_length=256, db_column="fullname", null=False, blank=False
    )
    enrollment_date = models.DateField(
        db_column="enrollment_date", auto_now=False, null=False, blank=False
    )
    profile_pic = models.URLField(db_column="profile_pic", max_length=256)
    gender = models.CharField(
        db_column="gender",
        max_length=6,
        choices=[("Male", "M"), ("Female", "F")],
        null=False,
        blank=False,
    )

    def __str__(self) -> str:
        return self.fullname

    class Meta:
        db_table = "students"
