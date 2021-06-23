import { AmountWidget } from './AmoutWidget.js';
import { templates, select } from '../settings.js';


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
  }

  initWidgets() {

    this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
    this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);

  }
}