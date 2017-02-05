const SCOPE = "https://www.googleapis.com/auth/calendar";

class CalendarService {
  constructor(clientId) {
    this._clientId = clientId;
  }

  connect() {
    return this.authorize_(true);
  }

  logInToGoogleCalendar() {
    return this.authorize_(false);
  }

  addEvent(dates, description) {
    return new Promise((resolve, reject) => {
      const recurenceDates = dates
        .map(day => day.format('YYYYMMDD'))
        .join(',');

      const event = {
        summary: description,
        start: {
          date: dates[0].format('YYYY-MM-DD')
        },
        end: {
          date: dates[0].format('YYYY-MM-DD')
        },
        recurrence: [
          'RDATE;VALUE=DATE:' + recurenceDates
        ]
      };

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      request.execute(event => {
        if (event.error) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  authorize_(immediate) {
    return new Promise((resolve, reject) => {
      gapi.auth.authorize({
        client_id: this._clientId,
        scope: SCOPE,
        immediate
      },
      authResult => {
        if (authResult && authResult.error) {
          reject(authResult.error);
        } else {
          gapi.client.load('calendar', 'v3');
          resolve();
        }
      });
    });
  }
}