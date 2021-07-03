import { AmountWidget } from './AmoutWidget.js';
import { templates, select } from '../settings.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


export class Booking {
  constructor(element) {

    this.render(element);
    this.initWidgets();
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