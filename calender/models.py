from django.db import models


class Calender(models.Model):
	event_id = models.CharField(max_length=40, primary_key=True)
	event_google_id = models.CharField(max_length=40, default="")
	event_name = models.CharField(max_length=200)
	location = models.CharField(max_length=200)
	start_date = models.CharField(max_length=50)
	start_time = models.CharField(max_length=50, default="")
	end_date = models.CharField(max_length=50)
	end_time = models.CharField(max_length=50, default="")
	all_day = models.BooleanField()
	description = models.TextField(default="")
	deleted = models.BooleanField(default=False)
	# def __str__(self):
	# 	return self.event_id + "/" + self.end_date + " "