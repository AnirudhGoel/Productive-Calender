from django.conf.urls import url

from . import views

app_name = 'calender'
urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^updateGoogleId/', views.updateGoogleId, name='updateGoogleId'),
	url(r'^googleIdExistsInDB/', views.googleIdExistsInDB, name='googleIdExistsInDB'),
	url(r'^insertEventFromGoogle/', views.insertEventFromGoogle, name='insertEventFromGoogle'),
	url(r'^alleventsj/', views.allEventsJSON, name='allEventsJSON'),
	url(r'^updateEvent/$', views.updateEvent, name='updateEvent'),
	url(r'^viewEvent/$', views.viewEvent, name='viewEvent'),
	url(r'^deleteEvent/$', views.deleteEvent, name='deleteEvent'),
	url(r'^forceDelete/$', views.forceDelete, name='forceDelete'),
	url(r'^allEvents/$', views.allEvents, name='allEvents'),
	url(r'^weather/$', views.weather, name='weather'),
	url(r'^getLocation/$', views.getLocation, name='getLocation'),
]