class RevisionCalendar {
  constructor(calendarService, days) {
    this._calendarService = calendarService;
    this._days = this._calculateDays(days);

    this._addRemindersCard = document.getElementById('add-reminders-card');
    this._logInCard = document.getElementById('log-in-card');
    this._loadingIndicator = document.getElementById('loader-container');
    this._logInButton = document.getElementById('log-in-button');
    this._saveButton = document.getElementById('save-button');
    this._description = document.getElementById('description');
    this._alert = document.getElementById('alert');
    this._dateList = document.getElementById('date-list');
  }

  run() {
    this._calendarService.connect()
      .then(() => this._handleAuthenticationSuccess())
      .catch(() => this._handleAuthenticationFailure());

    this._addEventListeners();
    this._prepareDateList();
  }

  _handleAuthenticationSuccess() {
    this._logInCard.classList.add('hidden');
    this._loadingIndicator.classList.add('hidden');
    this._addRemindersCard.classList.remove('hidden');
  }

  _handleAuthenticationFailure() {
    this._logInCard.classList.remove('hidden');
    this._loadingIndicator.classList.add('hidden');
  }

  _addEventListeners() {
    this._logInButton.onclick = () => this._handleLogIn();
    this._saveButton.onclick = () => this._handleSave();
  }

  _handleLogIn() {
    this._calendarService
      .logInToGoogleCalendar()
      .then(() => this._handleAuthenticationSuccess())
      .catch(() => this._handleAuthenticationFailure());
  }

  _handleSave() {
    const description = this._description.value;

    if (!description || !description.length) {
      this._showAlert('Description must not be empty!');
    } else {
      this._saveButton.disabled = true;
      const dates = this._days.map(date => date.date);

      this._calendarService
        .addEvent(dates, description)
        .then(() => this._handleReminderSaved())
        .catch(() => {
          this._showAlert('An error occured. Please refresh the page and try again.')
        });
    }
  }

  _showAlert(message) {
    this._alert.setAttribute('text', message);
    this._alert.open();
  }

  _handleReminderSaved() {
    this._saveButton.disabled = false;
    this._description.value = '';
    this._showAlert('Reminders added!');
  }

  _calculateDays(days) {
    return days.map(day => ({
      count: day,
      date: moment().add(day, 'days')
    }));
  }

  _prepareDateList() {
    this._days.forEach((day) => {
      const listElement = document.createElement('li');
      listElement.innerHTML = day.date.format('D MMMM') + ' (' + day.count + ' days)';
      this._dateList.appendChild(listElement);
    });
  }
}