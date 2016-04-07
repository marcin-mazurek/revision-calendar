function runApplication() {
  HTMLImports.whenReady(function () {
    displayDays();
    checkAuth();
  });
}

function calculateDays() {
  // TODO: use config.json
  var days = [3, 10, 30, 60];

  return days.map(function (day) {
    return {
      count: day,
      date: moment().add(day, 'days')
    }
  });
}

function saveReminder() {
  var description = document.getElementById('description').value;

  if (description === undefined || !description.length) {
    alert('Description must not be empty!');
  } else {
    var saveButton = document.getElementById('save-button');
    saveButton.disabled = true;
    callAPI(description, reminderSaved);
  }
}

function callAPI(description, successCallback) {
  var days = calculateDays();
  var firstDay = days[0].date;
  var nextDays = days.splice(1);

  var recurenceDates = nextDays.map(function(day) {
    return day.date.format('YYYYMMDD')
  }).join(',');

  var event = {
    summary: description,
    start: {
      date: firstDay.format('YYYY-MM-DD')
    },
    end: {
      date: firstDay.format('YYYY-MM-DD')
    },
    recurrence: [
      'RDATE;VALUE=DATE:' + recurenceDates
    ]
  };

  var request = gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });

  request.execute(successCallback);
}

function reminderSaved(event) {
  if (event.error) {
    alert('An error occured. Please refresh the page and try again.');
  }
  else {
    var saveButton = document.getElementById('save-button');
    saveButton.disabled = false;
    document.getElementById('description').value = '';
    document.getElementById('reminders-added-alert').open();
  }
}

function displayDays() {
  var daysList = document.getElementById('dates-list');

  calculateDays().forEach(function (day) {
    var listElement = document.createElement("LI");
    var description = document.createTextNode(day.date.format('D MMMM') + " (" + day.count + " days)");    // Create a text node
    listElement.appendChild(description);
    daysList.appendChild(listElement);
  });
}

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '332476624441-2hm92crmgm0i9tt13993i24a9o3c72sn.apps.googleusercontent.com';
var SCOPE = "https://www.googleapis.com/auth/calendar";

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPE,
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var addRemindersCard = document.getElementById('add-reminders-card');
  var logInCard = document.getElementById('log-in-card');
  var loadingIndicator = document.getElementById('loader-container');

  if (authResult && !authResult.error) {
    logInCard.className += ' hidden';
    addRemindersCard.className = addRemindersCard.className.replace('hidden ', '');
    loadingIndicator.className += ' hidden';
    loadCalendarApi();
  } else {
    logInCard.className = logInCard.className.replace('hidden ', '');
    loadingIndicator.className += ' hidden';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function authorize(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPE, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3');
}
