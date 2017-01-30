from django.db import models


class Calender(models.Model):
	event_id = models.CharField(max_length=40)
	event_name = models.CharField(max_length=200)
	location = models.CharField(max_length=200)
	start_date = models.CharField(max_length=50)
	start_time = models.CharField(max_length=50)
	end_date = models.CharField(max_length=50)
	end_time = models.CharField(max_length=50)
	all_day = models.BooleanField()
	description = models.TextField()