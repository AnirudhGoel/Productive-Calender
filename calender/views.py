from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
import json
import requests

from .models import Calender


def index(request):
	context = {}
	return render(request, 'calender/index.html', context)

def updateEvent(request):
	event_id = request.GET['eventId']
	event_name = request.GET['eventName']
	location = request.GET['eventLocation']
	start_date = request.GET['eventStartDate']
	start_time = request.GET['eventStartTime']
	end_date = request.GET['eventEndDate']
	end_time = request.GET['eventEndTime']
	all_day = request.GET['eventAllDay']
	description = request.GET['eventDescription']
	flag = 0
	id_start = 1

	if event_id == "":
		while flag == 0:
			if Calender.objects.filter(event_id = (str(id_start) + "-eve-" + start_date)).count() == 1:
				id_start += 1
			else:
				new_event_id = str(id_start) + "-eve-" + start_date
				flag = 1
		q = Calender(event_id = new_event_id, event_name = event_name, location = location, start_date = start_date, start_time = start_time, end_date = end_date, end_time = end_time, all_day = all_day, description = description)
		try:
			q.save()
			result = "Saved Successfully"
		except Exception as e:
			result = e

	else:
		new_event_id = event_id
		try:
			Calender.objects.filter(event_id = event_id).update(event_name = event_name, location = location, start_date = start_date, start_time = start_time, end_date = end_date, end_time = end_time, all_day = all_day, description = description, updated = (timezone.now() +timezone.timedelta(minutes=330)))
			result = "Event Updated"
		except Exception as e:
			result = e


	return HttpResponse(json.dumps({"result": result, "event_id": new_event_id}), content_type = "application/json")

def allEvents(request):
	# Returns all elements in string form where deleted = false
	response = ""
	q = Calender.objects.filter(deleted = False).values()
	for x in range(0,q.count()):
		response += q[x]["event_id"] + "/" + q[x]["end_date"] + " "
	return HttpResponse(response)

def allEventsJSON(request):
	# Returns all elements in JSON form
	response = {}
	q = Calender.objects.values()
	for x in range(0,q.count()):
		response[x] = {}
		response[x]["event_id"] = q[x]["event_id"]
		response[x]["event_google_id"] = q[x]["event_google_id"]
		response[x]["event_name"] = q[x]["event_name"]
		response[x]["location"] = q[x]["location"]
		response[x]["start_date"] = q[x]["start_date"]
		response[x]["start_time"] = q[x]["start_time"]
		response[x]["end_date"] = q[x]["end_date"]
		response[x]["end_time"] = q[x]["end_time"]
		response[x]["all_day"] = q[x]["all_day"]
		response[x]["description"] = q[x]["description"]
		response[x]["updated"] = str(q[x]["updated"])
		response[x]["deleted"] = q[x]["deleted"]
	return HttpResponse(json.dumps({"response": response}), content_type = "application/json")

def viewEvent(request):
	event_id = request.GET['eventId']

	q = Calender.objects.get(event_id = event_id)
	return HttpResponse(json.dumps({"event_name": q.event_name, "location": q.location, "start_date": q.start_date, "start_time": q.start_time, "end_date": q.end_date, "end_time": q.end_time, "all_day": q.all_day, "description": q.description}), content_type = "application/json")

# Sets event's delete property = true so that later it can be deleted from Google also
def deleteEvent(request):
	event_id = request.GET['eventId']
	q = Calender.objects.get(event_id = event_id)

	if q.event_google_id == "":
		try:
			Calender.objects.filter(event_id = event_id).delete()
			result = "Deleted Successfully"
		except Exception as e:
			result = e
	else:
		Calender.objects.filter(event_id = event_id).update(deleted = True)
		result = "Deleted Successfully"

	return HttpResponse(json.dumps({"result": result, "event_id": event_id}), content_type = "application/json")

# Deletes event from DB
def forceDelete(request):
	event_id = request.GET['eventId']

	try:
		Calender.objects.filter(event_id = event_id).delete()
		result = "Deleted Successfully"
	except Exception as e:
		result = e

	return HttpResponse(json.dumps({"result": result, "event_id": event_id}), content_type = "application/json")

def updateGoogleId(request):
	event_id = request.GET['eventId']
	event_google_id = request.GET['googleId']

	try:
		Calender.objects.filter(event_id = event_id).update(event_google_id = event_google_id)
		result = "Google ID added"
	except Exception as e:
		result = e

	return HttpResponse(json.dumps({"result": result, "event_id": event_id, "google_id": event_google_id}), content_type = "application/json")

def googleIdExistsInDB(request):
	event_google_id = request.GET['googleId']

	try:
		q = Calender.objects.filter(event_google_id = event_google_id)
		count = q.count()
		if count == 0:
			event_id = ""
			result = 0
		else:
			q = Calender.objects.get(event_google_id = event_google_id)
			event_id = q.event_id
			result = 1
	except Exception as e:
		event_id = ""
		result = e

	return HttpResponse(json.dumps({"result": result, "event_id": event_id}), content_type = "application/json")

def insertEventFromGoogle(request):
	event_google_id = request.GET['eventGoogleId']
	event_name = request.GET['eventName']
	location = request.GET['eventLocation']
	start_date = request.GET['eventStartDate']
	start_time = request.GET['eventStartTime']
	end_date = request.GET['eventEndDate']
	end_time = request.GET['eventEndTime']
	all_day = request.GET['eventAllDay']
	description = request.GET['eventDescription']
	flag = 0
	id_start = 1

	while flag == 0:
		if Calender.objects.filter(event_id = (str(id_start) + "-eve-" + start_date)).count() == 1:
			id_start += 1
		else:
			new_event_id = str(id_start) + "-eve-" + start_date
			flag = 1
	q = Calender(event_id = new_event_id, event_name = event_name, location = location, start_date = start_date, start_time = start_time, end_date = end_date, end_time = end_time, all_day = all_day, description = description, event_google_id = event_google_id)
	try:
		q.save()
		result = "Saved Successfully"
	except Exception as e:
		result = e

	return HttpResponse(json.dumps({"result": result, "event_id": new_event_id}), content_type = "application/json")


def getLocation(request):
	latitude = request.GET['latitude']
	longitude = request.GET['longitude']
	google_key = "AIzaSyDUIK7sIVpOXkhSovCbmfH9Tem3errVF6E"
	location = ""

	reverse_geocode_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=false&key=" + google_key

	data = requests.get(reverse_geocode_url)
	data = data.json()
	location = "delhi"

	if data["status"] == "OK":
		for i in range(0, len(data["results"][0]["address_components"])):
			try:
				data["results"][0]["address_components"][i]["types"].index("locality")
				location = data["results"][0]["address_components"][i]["long_name"]
				print("inside loop")
				print(location)
				break
			except:
				pass

	return HttpResponse(json.dumps({"location": location}), content_type = "application/json")


def weather(request):
	location = request.GET['location']

	key = "3dd5f9b1129b6750622c736c66971a45";
	url = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + ",in&appid=" + key;

	weather_data = requests.get(url)

	return HttpResponse(weather_data, content_type = "application/json")