from django.shortcuts import render
from django.http import HttpResponse
import json

from .models import Calender


def index(request):
	# context = {'latest_question_list': latest_question_list}
	context = ""
	return render(request, 'calender/index.html', context)

# def detail(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'polls/detail.html', {'question': question})

def sync(request):
	# context = {'latest_question_list': latest_question_list}
	context = ""
	return render(request, 'calender/sync.html', context)

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
			Calender.objects.filter(event_id = event_id).update(event_name = event_name, location = location, start_date = start_date, start_time = start_time, end_date = end_date, end_time = end_time, all_day = all_day, description = description)
			result = "Event Updated"
		except Exception as e:
			result = e


	return HttpResponse(json.dumps({"result": result, "event_id": new_event_id}), content_type = "application/json")

def allEvents(request):
	q = Calender.objects.all()
	return HttpResponse(q)

def viewEvent(request):
	event_id = request.GET['eventId']

	q = Calender.objects.get(event_id = event_id)
	return HttpResponse(json.dumps({"event_name": q.event_name, "location": q.location, "start_date": q.start_date, "start_time": q.start_time, "end_date": q.end_date, "end_time": q.end_time, "all_day": q.all_day, "description": q.description}), content_type = "application/json")

def deleteEvent(request):
	event_id = request.GET['eventId']

	try:
		Calender.objects.filter(event_id = event_id).delete()
		result = "Deleted Successfully"
	except Exception as e:
		result = e
	
	return HttpResponse(json.dumps({"result": result, "event_id": event_id}), content_type = "application/json")
