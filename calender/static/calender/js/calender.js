function calender(month) {

    // Variables to be used later.  Place holders right now.
    var padding = "";
    var totalFeb = "";
    var i = 1;
    var testing = "";

    var current = new Date();
    var cmonth = current.getMonth();
    var day = current.getDate();
    var year = current.getFullYear();
    var tempMonth = month + 1; //+1; //Used to match up the current month with the correct start date.
    var prevMonth = month - 1;

    // Determining if Feb has 28 or 29 days in it.  
    if (month == 1) {
        if ((year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0)) {
            totalFeb = 29;
        } else {
            totalFeb = 28;
        }
    }


    // Setting up arrays for the name of the months, days, and the number of days in the month.

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var totalDays = ["31", "" + totalFeb + "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];


    // Temp values to get the number of days
    // in current month, and previous month.
    // Also getting the day of the week.

    var tempDate = new Date(tempMonth + ' 1 ,' + year);
    var tempweekday = tempDate.getDay();
    var tempweekday2 = tempweekday;
    var dayAmount = totalDays[month];
    // var preAmount = totalDays[prevMonth] - tempweekday + 1;	


    // After getting the first day of the week for
    // the month, padding the other days for that
    // week with the previous months days.  IE, if
    // the first day of the week is on a Thursday,
    // then this fills in Sun - Wed with the last
    // months dates, counting down from the last
    // day on Wed, until Sunday.

    while (tempweekday > 0) {
        padding += "<td class='premonth'></td>";
        //preAmount++;
        tempweekday--;
    }

    // Filling in the calender with the current
    // month days in the correct location along.

    while (i <= dayAmount) {


        // Determining when to start a new row

        if (tempweekday2 > 6) {
            tempweekday2 = 0;
            padding += "</tr><tr>";
        }


        // checking to see if i is equal to the current day, if so then we are making the color of
        // that cell a different color using CSS.

        if (i == day && month == cmonth) {
            padding += "<td onclick='td_click(event);' class='currentday' id='" + i + monthNames[month] + "'><span class='date'>" + i + "</span></td>";
        } else {
            padding += "<td onclick='td_click(event);'  id='" + i + monthNames[month] + "'><span class='date'>" + i + "</span></td>";
        }

        tempweekday2++;
        i++;
    }



    // Output the calender onto the site.  Also, putting in the month name and days of the week.

    var calenderTable = "<table>";
    calenderTable += "<tr class='table-header'>  <th>Sunday</th>  <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th> <th>Saturday</th> </tr>";
    calenderTable += "<tr>";
    calenderTable += padding;
    calenderTable += "</tr></table>";



    $(".container").html(calenderTable);
    $(".month").text(monthNames[month]);
    $(".month").attr('id', month);
    $(".year").text(year);
}

function nextmonth() {
    if ($(".month").attr('id') != 11) {
        var nextmon = Number($(".month").attr('id')) + 1;
    } else {
        var nextmon = 0;
    }
    // console.log(nextmon);
    calender(nextmon);
    calculateWeather();
    refreshAllEvents();
}

function prevmonth() {
    if ($(".month").attr('id') != 0) {
        var prevmon = Number($(".month").attr('id')) - 1;
    } else {
        var prevmon = 11;
    }
    // console.log(prevmon);
    calender(prevmon);
    calculateWeather();
    refreshAllEvents();
}

if (window.addEventListener) {
    var current = new Date();
    cmonth = current.getMonth();
    calender(cmonth);
    calculateWeather();
    currentWeather();
    refreshAllEvents();
} else if (window.attachEvent) {
    var current = new Date();
    cmonth = current.getMonth();
    calender(cmonth);
    calculateWeather();
    currentWeather();
    refreshAllEvents();
}