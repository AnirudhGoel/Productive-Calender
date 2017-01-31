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
	description = request.GET.get('eventDescription', "")
	flag = 0
	id_start = 1

	if event_id == "":
		while flag == 0:
			if Calender.objects.filter(event_id = (str(id_start) + "-eve-" + start_date)).count() == 1:
				id_start += 1
			else:
				new_event_id = str(id_start) + "-eve-" + start_date
				flag = 1
	else:
		new_event_id = event_id

	q = Calender(event_id = new_event_id, event_name = event_name, location = location, start_date = start_date, start_time = start_time, end_date = end_date, end_time = end_time, all_day = all_day, description = description)
	try:
		q.save()
		result = "Saved Successfully"
	except Exception as e:
		result = e

	return HttpResponse(json.dumps({"result": result, "event_id": new_event_id}), content_type = "application/json")

def allEvents(request):
	q = Calender.objects.all()
	return HttpResponse(q)