var CLIENT_ID = '1058916560306-0oheqaces62v33hn2o9lbvljvmgc40q6.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    listUpcomingEvents();
  }
}


function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}


function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date("2017-01-01")).toISOString(),
    'timeMax': (new Date("2017-12-31")).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    console.log(response);
    var events = response.result.items;
    // appendPre('Upcoming events:');

    // if (events.length > 0) {
    //   for (i = 0; i < events.length; i++) {
    //     var event = events[i];
    //     var when = event.start.dateTime;
    //     if (!when) {
    //       when = event.start.date;
    //     }
    //     // appendPre(event.summary + ' (' + when + ')')
    //   }
    // } else {
    //   // appendPre('No upcoming events found.');
    // }
  });
}