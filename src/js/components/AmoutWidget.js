import { settings, select } from '../settings.js';

export class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    console.log('AmountWidget', thisWidget);
    console.log('constructor arguments', element);

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);
    thisWidget.initActions();
  }
  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    // TODO: add validation

    if (thisWidget.value !== newValue && !isNaN(newValue) && settings.amountWidget.defaultMin <= newValue && settings.amountWidget.defaultMax >= newValue) {
      thisWidget.value = newValue;
    }
    thisWidget.announce();
    thisWidget.input.value = thisWidget.value;

  }

  announce() {
    const thisWidget = this;
    const event = new CustomEvent('update', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', () => thisWidget.setValue(thisWidget.input.value));

    thisWidget.linkDecrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });

  }
}