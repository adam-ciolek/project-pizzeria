import { utils } from '../utils.js';
import { select, settings, classNames, templates } from '../settings.js';
import { CartProduct } from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initAction();
    // console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);


    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    // Moduł 8.9
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address,
      phone: thisCart.dom.phone,
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.subTotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);

  }

  initAction() {
    const thisCart = this;

    thisCart.dom.form.addEventListener('submit', function (e) {
      e.preventDefault();
      thisCart.sendOrder();
    });


    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });


    thisCart.dom.productList.addEventListener('update', function () {
      thisCart.update();
    });


    thisCart.dom.toggleTrigger.addEventListener('click', () => {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
  }

  add(menuProduct) {
    const thisCart = this;
    // console.log('adding product', menuProduct);
    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.product', thisCart.products);
    this.update();
  }
  // Moduł 8.5 sumowanie koszyka
  update() {
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for (let product of thisCart.products) {

      thisCart.totalNumber = thisCart.totalNumber + product.amount;

      thisCart.subTotalPrice += product.price;
    }

    thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;

    if (thisCart.totalNumber == 0) {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    }

    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalNumber.textContent = thisCart.totalNumber;
    thisCart.dom.subTotalPrice.textContent = thisCart.subTotalPrice;

    for (let price of thisCart.dom.totalPrice) {
      price.textContent = thisCart.totalPrice;
    }

  }
  // Moduł 8.6

  remove(CartProduct) {
    const thisCart = this;

    const indexOfProduct = thisCart.products.indexOf(CartProduct);

    thisCart.products.splice(indexOfProduct, 1);

    CartProduct.dom.wrapper.remove();

    thisCart.update();
  }

}

export default Cart;