// Initializing variables
var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var month_number = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var day_name = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var year = parseInt($(".year").attr('id'));

// If empty space or weather part of any date is clicked, create new event box
function td_click(event) {
	event.stopPropagation();
	closeEveBox(event);

	var td_id = event.target.id;
	if (td_id == "") {
		td_id = event.target.closest("td").id;
	}

	// Initializing new event box's input field as blank
	$("#eventName").val("");
	$("#eventLocation").val("");
	$("#eventStartTime").val("");
	$("#eventEndTime").val("");
	$("#eventDescription").val("");
	$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", true);
	$("#eventAllDay").removeClass("fa-square-o").addClass("fa-check-square-o");

	// 
	// Automatically setting start and end date in New event box
	// 
	var td_date = parseInt(td_id);
	var td_month = td_id.substr(td_date.toString().length);
	setStartEndDate(td_date, td_month);
	$(".eveBoxDate").text(td_date + " " + td_month + " " + year);

	// 
	// Displaying new event box at apt location
	// 
	$("#" + td_id).append("<div id='justForShowEvent'></div>");
	var td_left = $("#" + td_id).position().left;
	var td_width = $("#" + td_id).width();
	var windowWidth = $(window).width();
	var eventBoxWidth = $("#addEvent").width();
	if (td_left + td_width + eventBoxWidth > windowWidth) {
		$("#addEvent").show().css({position:"absolute", top:(event.pageY - 120), left: (td_left - eventBoxWidth)});
	} else {
		$("#addEvent").show().css({position:"absolute", top:(event.pageY - 120), left: (td_left + td_width + 8)});
	}
}

// 
// Automatically setting the start and end date of event box's input field
// 
function setStartEndDate(date, month) {
	if (date < 10) {date = "0" + date};
	month = month_number[month_names.indexOf(month)];

	$("#eventStartDate").val(year + "-" + month + "-" + date);
	$("#eventEndDate").val(year + "-" + month + "-" + date);
}

// 
// Close new event box and edit event box and remove color from selected event
// 
function closeEveBox(e) {
	e.preventDefault();

	$("#justForShowEvent").remove();
	$(".event-rectangles").removeClass("event-rectangle-select");
	$("#addEvent").hide();
	$("#viewEvent").hide();
}

// 
// Check if the event is all day event by checking the Font Awesome Icon state
// 
function allDay() {
	if ($(".fa-check-square-o").length) {
		$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", false);
		$("#eventAllDay").removeClass("fa-check-square-o").addClass("fa-square-o");
	} else {
		$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", true);
		$("#eventAllDay").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
}

// 
// Updating the clicked event
// 
function updateEvent(e) {
	e.preventDefault();

	$("#error").text("");
	var eventId = $("#eventId").val();
	var eventName = $("#eventName").val();
	var eventLocation = $("#eventLocation").val();
	var eventStartDate = String($("#eventStartDate").val());
	var eventStartTime = String($("#eventStartTime").val());
	var eventEndDate = String($("#eventEndDate").val());
	var eventEndTime = String($("#eventEndTime").val());
	var eventDescription = $("#eventDescription").val();
	if ($(".fa-check-square-o").length) {
		var eventAllDay = 1;
		eventStartTime = "";
		eventEndTime = "";
	}
	else
		var eventAllDay = 0;

	if (eventStartDate > eventEndDate) {
		$("#error").text("End date cannot be earlier than start date");
	} else if (eventStartDate.substr(0, 7) != eventEndDate.substr(0, 7)) {
		$("#error").text("Event cannot stretch across months");
	} else if (eventStartTime != "" && eventEndTime == "") {
		$("#error").text("Fill both event start and end time");
	} else if (eventStartTime == "" && eventEndTime != "") {
		$("#error").text("Fill both event start and end time");
	} else {
		$.getJSON("updateEvent/", {eventId: eventId, eventName: eventName, eventLocation: eventLocation, eventStartDate: eventStartDate, eventStartTime: eventStartTime, eventEndDate: eventEndDate, eventEndTime: eventEndTime, eventAllDay: eventAllDay, eventDescription: eventDescription}, function(data) {
			// console.log(data);
			$("#status").text(data["result"]);
			$("#justForShowEvent").remove();
			$("#addEvent").hide();
			refreshAllEvents();
		});
	}
}

// 
// Display clicked event's details when any event is clicked
// 
function event_rectangle_clicked(event) {
	event.stopPropagation();
	closeEveBox(event);

	// console.log(event);
	$(".viewEveBoxName").text(event.target.innerHTML);
	var event_id = event.target.id;
	$("[id=" + event_id + "]").addClass("event-rectangle-select");
	$("#viewEveBoxEveId").text(event_id);
	// console.log(event);
	$.getJSON("viewEvent/", {eventId: event_id}, function(data) {
		// console.log(data);
		$(".viewTitle").text(data["event_name"]);
		$(".viewLocation").text(data["location"]);
		
		if (data["description"] != "") {
			$(".viewDescription").text(data["description"]);
		}
		
		var start_date = new Date(data["start_date"].replace(/-/g,'/'));
		var day_num = start_date.getDay();
		var day = day_name[day_num];
		var date = parseInt(data["start_date"].substr(8,2));
		var month = month_names[parseInt(data["start_date"].substr(5,2)) - 1];

		if (data["all_day"] == true || data["start_time"] == "") {
			$(".viewDay").text(day + ", " + month + " " + date);
		} else {
			$(".viewDay").text(data["start_time"] + ", " + day + ", " + month + " " + date);
		}

		var parent_td = $("#" + event.target.id).parent();
		// console.log(parent_td.width());
		var parent_td_left = parent_td.position().left;
		var parent_td_width = parent_td.width();
		var windowWidth = $(window).width();
		var eventBoxWidth = $("#viewEvent").width();
		if (parent_td_left + parent_td_width + eventBoxWidth + 30 > windowWidth) {
			$("#viewEvent").show().css({position:"absolute", top:(event.pageY - 120), left: (parent_td_left - eventBoxWidth)});
		} else {
			$("#viewEvent").show().css({position:"absolute", top:(event.pageY - 120), left: (parent_td_left + parent_td_width + 8)});
		}
	});
}

// 
// Delete an event
// 
function deleteEve(event) {
	event.preventDefault();
	event.stopPropagation();

	var event_id = $("#viewEveBoxEveId").text();

	$.getJSON("deleteEvent/", {eventId: event_id}, function(data) {
		$("#status").text(data["result"]);
		closeEveBox(event);
		refreshAllEvents();
	});
}

// 
// Display Edit event box with clicked event's details when an event is clicked
// 
function editEve(event) {
	event.preventDefault();
	event.stopPropagation();

	var event_id = $("#viewEveBoxEveId").text();

	$.getJSON("viewEvent/", {eventId: event_id}, function(data) {
		$("#eventId").val(event_id);
		$("#eventName").val(data["event_name"]);
		$("#eventLocation").val(data["location"]);
		$("#eventStartDate").val(data["start_date"]);
		$("#eventStartTime").val(data["start_time"]);
		$("#eventEndDate").val(data["end_date"]);
		$("#eventEndTime").val(data["end_time"]);
		$("#eventDescription").val(data["description"]);
		if (data["all_day"] == true) {
			$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", true);
			$("#eventAllDay").removeClass("fa-square-o").addClass("fa-check-square-o");
		} else {
			$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", false);
			$("#eventAllDay").removeClass("fa-check-square-o").addClass("fa-square-o");
		}
		var date = parseInt(data["start_date"].substr(8,2));
		var month = month_names[parseInt(data["start_date"].substr(5,2)) - 1];
		$(".eveBoxDate").text(date + " " + month + " " + year);

		closeEveBox(event);
		$("#" + event_id).addClass("event-rectangle-select");
		if ($(window).width() > 750) {
			$("#addEvent").show().css({position: "absolute", top: (event.pageY - 375), left: (event.pageX - 220)});
		} else {
			$("#addEvent").show().css({position: "absolute", top: (event.pageY - 235), left: (event.pageX - 110)});
		}
	});
}

// 
// Refresh all events
// 
function refreshAllEvents() {

	$(".event-rectangles").remove();

	$.get("allEvents/", function(data) {
		var event_id_end_date = data.split(" ");
		var event_list = [];
		for (var i = 0; i < event_id_end_date.length - 1; i++) {
			event_list.push({event_id: event_id_end_date[i].split("/")[0], end_date: event_id_end_date[i].split("/")[1]});
		}

		for (var i = 0; i < event_list.length; i++) {
			var eventStartDate = event_list[i]["event_id"].substr(6, 10);
			var eventEndDate = event_list[i]["end_date"];
			var eventId = event_list[i]["event_id"];

			if (eventStartDate == eventEndDate) {
				eventDivId = parseInt(eventStartDate.substr(8, 2)) + month_names[month_number.indexOf(eventStartDate.substr(5, 2))];
				// console.log(eventDivId);
				$("#" + eventDivId).append("<div onclick='event_rectangle_clicked(event);' class='event-rectangles' id='" + eventId +"'>Event " + (i + 1) + "</div>");
			} else {
				var Date1 = eventStartDate;
				var Date2 = eventEndDate;
				Date1 = new Date(Date1.replace(/-/g,'/'));
				Date2 = new Date(Date2.replace(/-/g,'/'));
				var timeDiff = Math.abs(Date2.getTime() - Date1.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
				// console.log(diffDays);

				for (var j = 0; j <= diffDays; j++) {
					eventDivId = parseInt(eventStartDate.substr(8, 2)) + j + month_names[month_number.indexOf(eventStartDate.substr(5, 2))];
					// console.log(eventDivId);
					$("#" + eventDivId).append("<div onclick='event_rectangle_clicked(event);' class='event-rectangles joint-event' id='" + eventId +"'>Event " + (i + 1) + "</div>");
				}
			}
		}
	});
}