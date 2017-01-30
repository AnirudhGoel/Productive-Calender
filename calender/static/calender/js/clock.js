function clock() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();

    if (h > 12) {var ap = "PM"; h -= 12} else {var ap = "AM";}
    if (m < 10) {m = "0" + m};  // add zero in front of numbers < 10

    $("#hourmin").text(h + ":" + m);
    $("#ap").text(ap);
    var t = setTimeout(clock, 500);
}
clock();