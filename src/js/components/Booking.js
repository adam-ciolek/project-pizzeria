import { AmountWidget } from './AmoutWidget.js';
import { templates, select, settings } from '../settings.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import { utils } from '../utils.js';


export class Booking {
  constructor(element) {

    this.render(element);
    this.initWidgets();
    this.getData();
  }

  getData() {

    const startDateParam = settings.dbN.dateStartParamKey + '=' + utils.dateToStr(this.datePicker.minDate);
    const endDateParam = settings.dbN.dateEndParamKey + '=' + utils.dateToStr(this.datePicker.maxDate);


    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.dbN.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.dbN.repeatParam,
        endDateParam,
      ],
    };
    console.log(params);

    const urls = {
      booking: settings.dbN.url + '/' + settings.dbN.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.dbN.url + '/' + settings.dbN.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.dbN.url + '/' + settings.dbN.event + '?' + params.eventsRepeat.join('&'),
    };
    console.log(urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
      });

  }

  render(element) {

    const generatedHTML = templates.bookingWidget();

    this.dom = {};
    this.dom.wrapper = element;
    this.dom.wrapper.innerHTML = generatedHTML;
    this.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    this.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    this.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    this.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
  }

  initWidgets() {

    this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
    this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);
    this.datePicker = new DatePicker(this.dom.datePicker);
    this.hourPicker = new HourPicker(this.dom.hourPicker);



  }
}