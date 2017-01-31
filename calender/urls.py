from django.conf.urls import url

from . import views

app_name = 'calender'
urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^sync/', views.sync, name='sync'),
	url(r'^updateEvent/$', views.updateEvent, name='updateEvent'),
	url(r'^allEvents/$', views.allEvents, name='allEvents'),
]