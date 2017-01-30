from django.shortcuts import render

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