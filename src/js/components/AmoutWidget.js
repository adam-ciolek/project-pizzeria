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

  isValid(value) {
    return !isNaN(value)
      && settings.amountWidget.defaultMin <= value
      && settings.amountWidget.defaultMax >= value;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.correctValue;

  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.dom.input.value);
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