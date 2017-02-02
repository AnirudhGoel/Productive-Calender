from django.conf.urls import url

from . import views

app_name = 'calender'
urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^googlecale/', views.google_cale, name='google_cale'),
	url(r'^alleventsj/', views.allEventsJSON, name='allEventsJSON'),
	url(r'^updateEvent/$', views.updateEvent, name='updateEvent'),
	url(r'^viewEvent/$', views.viewEvent, name='viewEvent'),
	url(r'^deleteEvent/$', views.deleteEvent, name='deleteEvent'),
	url(r'^allEvents/$', views.allEvents, name='allEvents'),
]