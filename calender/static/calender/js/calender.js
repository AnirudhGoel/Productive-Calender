var current = new Date();
var currentMonth = current.getMonth();
var currentDate = current.getDate();
var currentYear = current.getFullYear();

function calender(month, year) {
    var padding = "";

    // Determining if Feb has 28 or 29 days
    febDays = ((currentYear % 100 !== 0) && (currentYear % 4 === 0) || (currentYear % 400 === 0)) ? 29 : 28;

    // Setting up arrays for the name of the months, days, and the number of days in the month.
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var numberOfDays = ["31", String(febDays), "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];

    // Using (month + 1) because this function uses Jan as 1, Feb as 2, so on.
    var firstDate = new Date(monthNames[month] + ' 1, ' + year);
    var firstDay = firstDate.getDay();
    var totalDays = numberOfDays[month];

    // After getting the first day of the week for the month, padding the other days for that week with the previous months days, i.e., if the first day of the week is on a Thursday, then this fills in Sun - Wed with the last months dates, counting down from the last day on Wed, until Sunday.
    for (var i = 0; i < firstDay; i++) {
        padding += "<td class='preMonth'></td>";
    }

    var generateDay = firstDay;
    var generateCal = "";

    for (var i = 1; i <= totalDays; i++) {
        // Determining when to start a new row
        if (generateDay > 6) {
            generateCal += "</tr><tr>";
            generateDay = 0;
        }

        // Checking to see if i is equal to the current day, if so then we are making the color of that cell a different color using CSS.
        if (i == currentDate && month == currentMonth) {
            generateCal += "<td onclick='td_click(event);' class='currentday' id='" + i + monthNames[month] + "'><span class='date'>" + i + "</span></td>";
        } else {
            generateCal += "<td onclick='td_click(event);'  id='" + i + monthNames[month] + "'><span class='date'>" + i + "</span></td>";
        }

        generateDay++;
    }

    // Output the calender onto the site.  Also, putting in the month name and days of the week.
    var calenderTable = "<table>";
    if ($(window).width() < 750) {
        calenderTable += "<tr class='table-header'> <th>Sun</th> <th>Mon</th> <th>Tues</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th> </tr>";
    } else {
        calenderTable += "<tr class='table-header'> <th>Sunday</th> <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th> <th>Saturday</th> </tr>";
    }
    calenderTable += "<tr>";
    calenderTable += padding;
    calenderTable += generateCal;
    calenderTable += "</tr></table>";

    $(".container").html(calenderTable);
    $(".month").text(monthNames[month]);
    $(".month").attr('id', month);
    $(".year").text(year);
    $(".year").attr('id', year);
}

// 
// Display next month in Calender
// 
function nextMonth() {
    if ($(".month").attr('id') != 11) {
        var nextMon = Number($(".month").attr('id')) + 1;
        var year = Number($(".year").attr('id'));
    } else {
        var nextMon = 0;
        var year = Number($(".year").attr('id')) + 1;
    }
    // console.log(nextmon);
    calender(nextMon, year);
    calculateWeather();
    refreshAllEvents();
}

// 
// Display previous month in Calender
// 
function prevMonth() {
    if ($(".month").attr('id') != 0) {
        var prevMon = Number($(".month").attr('id')) - 1;
        var year = Number($(".year").attr('id'));
    } else {
        var prevMon = 11;
        var year = Number($(".year").attr('id')) - 1;
    }
    // console.log(prevmon);
    calender(prevMon, year);
    calculateWeather();
    refreshAllEvents();
}

// 
// Load calender and weather
// 
if (window.addEventListener) {
    calender(currentMonth, currentYear);
    calculateWeather();
    refreshAllEvents();
} else if (window.attachEvent) {
    calender(currentMonth, currentYear);
    calculateWeather();
    refreshAllEvents();
}

// 
// Whenever window is resized, page is reloaded so as to change full day names to short names to ensure responsiveness.
// Eg - Wednesday -> Wed
// 
$(window).resize(function() {
    if ($(window).width() < 750) {
        $(".table-header").html("<th>Sun</th> <th>Mon</th> <th>Tues</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th>");
    } else {
        $(".table-header").html("<th>Sunday</th> <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th> <th>Saturday</th>");
    }
});