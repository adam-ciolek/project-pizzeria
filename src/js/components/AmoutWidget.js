import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';


export class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements(element);

    thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);

    thisWidget.initActions();
  }
  getElements() {
    const thisWidget = this;

    // thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

  }

  // setValue(value) {
  //   const thisWidget = this;
  //   const newValue = thisWidget.parseValue(value);
  //   // TODO: add validation

  //   if (thisWidget.value !== newValue && thisWidget.isValid(newValue)) {
  //     thisWidget.value = newValue;
  //   }
  //   thisWidget.announce();

  //   thisWidget.renderValue();

  // }

  // parseValue(value) {
  //   return parseInt(value);
  // }

  isValid(value) {
    return !isNaN(value)
      && settings.amountWidget.defaultMin <= value
      && settings.amountWidget.defaultMax >= value;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.correctValue;

  }

  // announce() {
  //   const thisWidget = this;
  //   const event = new CustomEvent('update', {
  //     bubbles: true
  //   });
  //   thisWidget.element.dispatchEvent(event);
  // }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.dom.input.value)
      // thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.setValue(thisWidget.correctValue - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.setValue(thisWidget.correctValue + 1);
    });

  }
}