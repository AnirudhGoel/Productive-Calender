// Initializing variables
var CLIENT_ID = '1058916560306-0oheqaces62v33hn2o9lbvljvmgc40q6.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";
var authorizeButton = document.getElementById('authorize-button');
var year = $(".year").attr('id');

// 
// Login on page load
// 
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
  });
}

function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = 'none';
		$("#sync").attr("onclick","syncCal();");
	}
}

function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}


// 
// Sync step by step
// 1. Iterate through DB data and delete events from Google Cal, which have been deleted from Local Cal but not from Google Cal
// 2. Check which DB items haven't been added to Google Cal and add them
// 3. If event has already been added to Google Cal, check which event has been modified later and sync the other Cal event according to it
// 
function syncCal() {
	$(".fa-refresh").addClass("fa-spin");

	// 
	// Call all events from Google and DB
	// 
	gapi.client.calendar.events.list({
		'calendarId': 'primary',
		'timeMin': (new Date(year + "-01-01")).toISOString(),
		'timeMax': (new Date(year + "-12-31")).toISOString(),
		'showDeleted': false,
		'singleEvents': true,
		'orderBy': 'startTime'
	}).then(function(google_response) {
	    $.getJSON("alleventsj/", function(db_response) {
	        db_response = db_response["response"];
	        google_response = google_response.result.items;
	        db_response_items_num = Object.keys(db_response).length;
	        // console.log(db_response, google_response);

	        // Delete events from Google Cal, which have been deleted from Local Cal but not from Google Cal
	        for (var i = 0; i < db_response_items_num; i++) {
	            deleteEvent(db_response, i);
	        }

	        for (var i = 0; i < db_response_items_num; i++) {
	            db_event_id = db_response[i]["event_id"];

	            // 
	            // Check if event from Local Cal has been added to Google Cal
	            // 
	            if (db_response[i]["event_google_id"] != "" && db_response[i]["deleted"] == false) {
	                var flag = 0;
	                for (var j = 0; j < google_response.length; j++) {
	                    if (google_response[j]["id"] == db_response[i]["event_google_id"]) {

	                        flag = 1;

	                        var oldDateObj = new Date(db_response[i]["updated"]);
	                        var newDateObj = (new Date(oldDateObj.getTime() - 330*60000)).toISOString();

	                        // 
	                        // Check which event has been modified later
                            // If db event has been modified after google event, update Google event
                            // 
	                        if (newDateObj > google_response[j]["updated"]) {

	                            // console.log("Here", newDateObj);
	                            var start_time = db_response[i]["start_time"];
	                            var end_time = db_response[i]["end_time"];

	                            if (start_time == "" || end_time == "" || db_response[i]["all_day"] == true) {
	                            	// If start or end time is blank, give only date as it is an all day event
	                                var object = {
	                                    'end': {
	                                        'date': db_response[i]["end_date"],
	                                        'timeZone': 'Asia/Calcutta'
	                                    },
	                                    'start': {
	                                        'date': db_response[i]["start_date"],
	                                        'timeZone': 'Asia/Calcutta'
	                                    },
	                                    'summary' : db_response[i]["event_name"],
	                                    'location' : db_response[i]["location"],
	                                    'description' : db_response[i]["description"]
	                                };
	                            } else {
	                            	// If start or end time is not blank, give dateTime
	                                var end_datetime = db_response[i]["end_date"] + "T" + db_response[i]["end_time"] + ":00";
	                                var start_datetime = db_response[i]["start_date"] + "T" + db_response[i]["start_time"] + ":00";
	                                var object = {
	                                    'end': {
	                                        'dateTime': end_datetime,
	                                        'timeZone': 'Asia/Calcutta'
	                                    },
	                                    'start': {
	                                        'dateTime': start_datetime,
	                                        'timeZone': 'Asia/Calcutta'
	                                    },
	                                    'summary' : db_response[i]["event_name"],
	                                    'location' : db_response[i]["location"],
	                                    'description' : db_response[i]["description"]
	                                };
	                            }
	                            // console.log(object);

	                            var calendarObject =
	                            {
	                                'calendarId': 'primary',
	                                'eventId' : google_response[j]["id"],
	                                'resource': object
	                            };
	                            
	                            gapi.client.calendar.events.update(calendarObject).then(function() {
	                                console.log("Google calendar updated");
	                            });

	                        } else {
	                        	// If google event has been modified after db event, update db event

	                            if (google_response[j]["start"]["dateTime"]) {
	                            	// If dateTime parameter is given, it is not a all day event
	                                var date = new Date(google_response[j]["start"]["dateTime"]);
	                                var year = date.getFullYear();
	                                var month = date.getMonth()+1;
	                                var dt = date.getDate();
	                                var hour = date.getHours();
	                                var mins = date.getMinutes();
	                                if (dt < 10) {dt = '0' + dt;}
	                                if (month < 10) {month = '0' + month;}
	                                if (hour < 10) {hour = '0' + hour;}
	                                if (mins < 10) {mins = '0' + mins;}

	                                updated_start_date = year+'-' + month + '-'+ dt;
	                                updated_start_time = hour + ":" + mins;
	                                updated_all_day = 0;

	                                var date = new Date(google_response[j]["end"]["dateTime"]);
	                                var year = date.getFullYear();
	                                var month = date.getMonth()+1;
	                                var dt = date.getDate();
	                                var hour = date.getHours();
	                                var mins = date.getMinutes();
	                                if (dt < 10) {dt = '0' + dt;}
	                                if (month < 10) {month = '0' + month;}
	                                if (hour < 10) {hour = '0' + hour;}
	                                if (mins < 10) {mins = '0' + mins;}

	                                updated_end_date = year+'-' + month + '-'+ dt;
	                                updated_end_time = hour + ":" + mins;
	                            
	                            } else {
	                            	// If date parameter is given, it is an all day event
	                                var date = new Date(google_response[j]["start"]["date"]);
	                                var year = date.getFullYear();
	                                var month = date.getMonth()+1;
	                                var dt = date.getDate();
	                                if (dt < 10) {dt = '0' + dt;}
	                                if (month < 10) {month = '0' + month;}

	                                updated_start_date = year+'-' + month + '-'+ dt;
	                                updated_start_time = "";
	                                updated_all_day = 1;

	                                var date = new Date(google_response[j]["end"]["date"]);
	                                var year = date.getFullYear();
	                                var month = date.getMonth()+1;
	                                var dt = date.getDate();
	                                if (dt < 10) {dt = '0' + dt;}
	                                if (month < 10) {month = '0' + month;}

	                                updated_end_date = year+'-' + month + '-'+ dt;
	                                updated_end_time = "";

	                            }

	                            var google_response_location = google_response[j]['location'];
	                            if (!google_response_location) {google_response_location = "";}

	                            var google_response_description = google_response[j]['description'];
	                            if (!google_response_description) {google_response_description = "";}

	                            $.getJSON("updateEvent/", {eventId: db_response[i]["event_id"], eventName: google_response[j]["summary"], eventLocation: google_response_location, eventStartDate: updated_start_date, eventStartTime: updated_start_time, eventEndDate: updated_end_date, eventEndTime: updated_end_time, eventAllDay: updated_all_day, eventDescription: google_response_description}, function(data) {
	                                console.log(data, "DB data updated");
	                            });
	                        }   
	                    }
	                }

	                if (flag == 0) {
	                    $.get("forceDelete/", {eventId: db_response[i]["event_id"]}, function(res) {
	                        console.log("Deleted because deleted from Google also", res);
							refreshAllEvents();
	                    });
	                }
	            } else if (db_response[i]["event_google_id"] == "") {
	                // If Google ID is blank, add event to google

	                if (db_response[i]["all_day"] == true || db_response[i]["start_time"] == "" || db_response[i]["end_time"] == "") {
	                	// If start or end time is not given, add it as an whole day event
						var object = {
							'summary': db_response[i]["event_name"],
							'location': db_response[i]["location"],
							'description': db_response[i]["description"],
							'start': {
								'date': db_response[i]["start_date"],
								'timeZone': 'Asia/Calcutta'
							},
							'end': {
								'date': db_response[i]["end_date"],
								'timeZone': 'Asia/Calcutta'
							},
							'attendees': [
								{'email': 'anirudhgoel.delhi@gmail.com'}
							],
								'reminders': {
								'useDefault': false,
							}
						};
	                } else {
	                	// If start or end time is given, add it as a timed event
	                    var end_datetime = db_response[i]["end_date"] + "T" + db_response[i]["end_time"] + ":00";
	                    var start_datetime = db_response[i]["start_date"] + "T" + db_response[i]["start_time"] + ":00";
						var object = {
							'summary': db_response[i]["event_name"],
							'location': db_response[i]["location"],
							'description': db_response[i]["description"],
							'start': {
								'dateTime': start_datetime,
								'timeZone': 'Asia/Calcutta'
							},
							'end': {
								'dateTime': end_datetime,
								'timeZone': 'Asia/Calcutta'
							},
							'attendees': [
								{'email': 'anirudhgoel.delhi@gmail.com'}
							],
							'reminders': {
							'useDefault': true,
							}
						}
	                }

	                current_db_event_id = db_response[i]["event_id"];
	            	// console.log(i);

	            	insertToGoogle(db_response, object, i);
	            }
	        }
	    }).done(function() {
	    	$(".fa-refresh").removeClass("fa-spin");
	    	$("#status").text("Synced");
	    });
	});
}

function insertToGoogle(db_response, obj, i) {
	gapi.client.calendar.events.insert({
		'calendarId': 'primary',
		'resource': obj
	}).execute(function(data) {
		console.log("Event adding to Google", data);
		new_google_id = data["id"];
    	// console.log(i);
        $.get("updateGoogleId/", {eventId: db_response[i]["event_id"], googleId: new_google_id}, function(res) {
            console.log("Updated google id added to db", res);
        });
	});
}

function deleteEvent(db_response, i) {
	// console.log(db_response, i);
	if (db_response[i]["deleted"] == true) {
	    gapi.client.calendar.events.delete({
	        'calendarId' : 'primary',
	        'eventId' : db_response[i]["event_google_id"]
	    }).then(function(data) {
	        $.get("forceDelete/", {eventId: db_response[i]["event_id"]}, function(res) {
	            console.log("Deleted", res);
	        });
	    });
	}
}