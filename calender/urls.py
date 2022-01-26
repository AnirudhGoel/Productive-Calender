from django.urls import re_path

from . import views

app_name = 'calender'
urlpatterns = [
	re_path(r'^$', views.index, name='index'),
	re_path(r'^updateGoogleId/', views.updateGoogleId, name='updateGoogleId'),
	re_path(r'^googleIdExistsInDB/', views.googleIdExistsInDB, name='googleIdExistsInDB'),
	re_path(r'^insertEventFromGoogle/', views.insertEventFromGoogle, name='insertEventFromGoogle'),
	re_path(r'^alleventsj/', views.allEventsJSON, name='allEventsJSON'),
	re_path(r'^updateEvent/$', views.updateEvent, name='updateEvent'),
	re_path(r'^viewEvent/$', views.viewEvent, name='viewEvent'),
	re_path(r'^deleteEvent/$', views.deleteEvent, name='deleteEvent'),
	re_path(r'^forceDelete/$', views.forceDelete, name='forceDelete'),
	re_path(r'^allEvents/$', views.allEvents, name='allEvents'),
	re_path(r'^weather/$', views.weather, name='weather'),
	re_path(r'^getLocation/$', views.getLocation, name='getLocation'),
]