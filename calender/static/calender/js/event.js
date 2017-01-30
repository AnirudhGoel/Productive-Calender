$("td").click(function(event) {
	

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
});

function setStartDate(date, month) {
	var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var month_number = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
	if (date < 10) {date = "0" + date};
	month = month_number[month_names.indexOf(month)];

	$("#eventStartDate").val("2017-" + month + "-" + date);
	$("#eventEndDate").val("2017-" + month + "-" + date);
}

function closeEveBox() {
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

	console.log(eventName, eventLocation, eventStartDate, eventStartTime, eventAllDay);
}