var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var month_number = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];


function event_rectangle_clicked(event) {
	event.stopPropagation();
};

function td_click(event) {
	event.stopPropagation();

	var td_id = event.target.id;
	if (td_id == "") {
		td_id = event.target.closest("td").id;
	}
	// $("#eventId").attr("value", td_id);
	var td_date = parseInt(td_id);
	var td_month = td_id.substr(td_date.toString().length);
	setStartDate(td_date, td_month);
	$(".eveBoxDate").text(td_date + " " + td_month + " " + "2017");
	$("#addEvent").show().css({position:"absolute", top:event.pageY, left: event.pageX});
};

function setStartDate(date, month) {
	if (date < 10) {date = "0" + date};
	month = month_number[month_names.indexOf(month)];

	$("#eventStartDate").val("2017-" + month + "-" + date);
	$("#eventEndDate").val("2017-" + month + "-" + date);
}

function closeEveBox(e) {
	e.preventDefault();

	$("#addEvent").hide();
	$("#viewEvent").hide();
}

function allDay() {
	if ($(".fa-check-square-o").length) {
		$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", false);
		$("#eventAllDay").removeClass("fa-check-square-o").addClass("fa-square-o");
	} else {
		$("#eventStartDate, #eventStartTime, #eventEndDate, #eventEndTime").attr("disabled", true);
		$("#eventAllDay").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
}

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
	var eventDescription = $("eventDescription").val();
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
	} else {
		// console.log(eventName, eventLocation, eventStartDate, eventStartTime, eventAllDay);

		$.getJSON("updateEvent/", {eventId: eventId, eventName: eventName, eventLocation: eventLocation, eventStartDate: eventStartDate, eventStartTime: eventStartTime, eventEndDate: eventEndDate, eventEndTime: eventEndTime, eventAllDay: eventAllDay, eventDescription: eventDescription}, function(data) {
			console.log(data);
			$("#status").text(data["result"]);
			$("#addEvent").hide();
			refreshAllEvents();
			// if (eventStartDate == eventEndDate) {
			// 	eventDivId = parseInt(eventStartDate.substr(8, 2)) + month_names[month_number.indexOf(eventStartDate.substr(5, 2))];
			// 	$("#" + eventDivId).append("<div onclick='event_rectangle_clicked(event);' class='event-rectangles' id='" + data["event_id"] +"'>Event " + data["event_id"].split("-")[0] + "</div>");
			// } else {
			// 	var Date1 = eventStartDate;
			// 	var Date2 = eventEndDate;
			// 	Date1 = new Date(Date1.replace(/-/g,'/'));
			// 	Date2 = new Date(Date2.replace(/-/g,'/'));
			// 	var timeDiff = Math.abs(Date2.getTime() - Date1.getTime());
			// 	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
			// 	console.log(diffDays);

			// 	for (var j = 0; j <= diffDays; j++) {
			// 		eventDivId = parseInt(eventStartDate.substr(8, 2)) + j + month_names[month_number.indexOf(eventStartDate.substr(5, 2))];
			// 		console.log(eventDivId);
			// 		$("#" + eventDivId).append("<div onclick='event_rectangle_clicked(event);' class='event-rectangles joint-event' id='" + eventId +"'>Event " + eventId.split("-")[0] + "</div>");
			// 	}
			// }
		});
	}
}

function refreshAllEvents() {
	$(".event-rectangles").remove();
	$.get("allEvents/", function(data) {

		var event_id_end_date = data.split(" ");
		var event_list = [];
		for (var i = 0; i < event_id_end_date.length - 1; i++) {
			event_list.push({event_id: event_id_end_date[i].split("/")[0], end_date: event_id_end_date[i].split("/")[1]});
		}

		// event_list.sort(function(a, b) {
		// 	return ((a.event_id < b.event_id) ? -1 : ((a.event_id == b.event_id) ? 0 : 1));
		// });

		// console.log(data);
		// console.log(event_list);
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
				console.log(diffDays);

				for (var j = 0; j <= diffDays; j++) {
					eventDivId = parseInt(eventStartDate.substr(8, 2)) + j + month_names[month_number.indexOf(eventStartDate.substr(5, 2))];
					console.log(eventDivId);
					$("#" + eventDivId).append("<div onclick='event_rectangle_clicked(event);' class='event-rectangles joint-event' id='" + eventId +"'>Event " + (i + 1) + "</div>");
				}
			}
		}

	});
}