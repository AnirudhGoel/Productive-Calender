// Weather descriptions as provided by Weather API - Open Weather Map
var weatherDesc = ["clear sky", "few clouds", "scattered clouds", "broken clouds", "shower rain", "rain", "thunderstorm", "snow", "mist"];
var weatherDescIcon = ["fa-sun-o", "fa-cloud", "fa-cloud", "fa-cloud", "fa-cloud", "fa-cloud", "fa-bolt", "fa-bolt", "fa-cloud"];

function calculateWeather() {
    // Trying to detect location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error);

        function showPosition(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            console.log(lat, lon);

            $.getJSON("getLocation/", {latitude: lat, longitude: lon}, function(data) {
                var location = data.location;
                calMinMaxWeather(location);
            });
        }

        function error() {
            calMinMaxWeather("delhi");    
        }
    } else {
        // If location detection is not supported, setting default location as Delhi.
        calMinMaxWeather("delhi");
    }
}

// Publishing min and max temperature in each calender date box
function publishWeather(date, month, min_temp, max_temp, icon) {
    min_temp = Math.round(min_temp);
    max_temp = Math.round(max_temp);
    $("<span class='weather'><i class='fa " + icon + "'></i>" + max_temp + "&deg;/<span style='font-size: 0.7em;'>" + min_temp + "&deg;</span></span>").insertAfter("#" + date + month + " .date");
}

// Publishing current weather in left bar
function currentWeather(data) {
    var cweather = Number(data['list'][0]['main']['temp']);
    cweather = Math.round(toCelsius(cweather));
    var weaDesc = data['list'][0]['weather'][0]['description'];
    var weaDescIcon = weatherDescIcon[weatherDesc.indexOf(weaDesc)];
    $("#current-weather").html("<span class='current-weather-big'><i class='fa " + weaDescIcon + "'></i>  " + cweather + "&deg;<span style='font-size: 0.6em;'>C</span></span>");
    $("#current-weather").append("<br><span style='font-size: 0.8em; padding-left: 25px;'>" + toTitleCase(weaDesc) + "</style>");
}

function calMinMaxWeather(location) {
    // Initializing variables
    var flag = 0;
    var old_max_temp = 0;
    var new_max_temp = 0;
    var old_min_temp = 0;
    var new_min_temp = 0;
    var old_date = 00;
    var short_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var full_month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $.getJSON("weather/", {location: location}, function(data) {
        currentWeather(data);

        var weaDesc = data['list'][0]['weather'][0]['description'];
        var weaDescIcon = weatherDescIcon[weatherDesc.indexOf(weaDesc)];

        // 
        // Loop for calculating Min and Max Weather
        // 
        for(var i=0; i < Number(data['list'].length); i++) {
            var dt = data['list'][i]['dt'];
            var full_date = (new Date(dt * 1000)).toUTCString();
            var new_date = full_date.substr(5,2);

            if (new_date == old_date) {
                new_min_temp = toCelsius(data['list'][i]['main']['temp_min']);
                new_max_temp = toCelsius(data['list'][i]['main']['temp_max']);
                if (new_max_temp > old_max_temp) {
                    old_max_temp = new_max_temp;
                }
                if (new_min_temp < old_min_temp) {
                    old_min_temp = new_min_temp;
                }
            } else {
                if (flag != 0) {
                    publishWeather(old_date, month, old_min_temp, old_max_temp, weaDescIcon);
                }
                old_date = Number(new_date);
                var month = full_date.substr(8,3);
                var month = full_month[short_month.indexOf(month)];
                old_min_temp = toCelsius(data['list'][i]['main']['temp_min']);
                old_max_temp = toCelsius(data['list'][i]['main']['temp_max']);
                flag = 1;
            }
        }
    });
}

// 
// Other useful functions
// 
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function toCelsius(k) {
    return (k-273.15);
}