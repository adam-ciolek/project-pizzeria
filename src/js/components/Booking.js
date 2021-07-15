import { AmountWidget } from './AmoutWidget.js';
import { templates, select, settings, classNames } from '../settings.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import { utils } from '../utils.js';


export class Booking {
  constructor(element) {

    this.render(element);
    this.initWidgets();
    this.getData();
    // ex 10.3
    this.selectedTable;
    this.starters= [];
  }

  getData() {
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(this.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(this.datePicker.maxDate);


    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };


    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    // console.log(urls);

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
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

  } 

  parseData(bookings, eventsCurrent, eventsRepeat) {

    this.booked = {};

    for (let item of bookings) {
      this.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      this.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = this.datePicker.minDate;
    const maxDate = this.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          this.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    console.log('book', this.booked);

    this.updateDOM();
  }

  makeBooked(date, hour, duration, table) {

    if (typeof this.booked[date] == 'undefined') {
      this.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      // console.log(hourBlock);
      if (typeof this.booked[date][hourBlock] == 'undefined') {
        this.booked[date][hourBlock] = [];
      }

      this.booked[date][hourBlock].push(table);
    }

  }

  updateDOM() {

    this.date = this.datePicker.value;
    this.hour = utils.hourToNumber(this.hourPicker.value);

    let allAvailable = false;

    if (typeof this.booked[this.date] == 'undefined' || typeof this.booked[this.date][this.hour] == 'undefined') {
      allAvailable = true;
    }

    for (let table of this.dom.tables) {
      // console.log('Table', this.dom.tables);
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      // console.log(tableId);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
        // console.log(tableId);
      }
      
      table.classList.remove(classNames.booking.tableSelected);

      if (!allAvailable && this.booked[this.date][this.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }

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

    this.dom.tables = document.querySelectorAll(select.booking.tables);
    
    this.dom.floorPlan = document.querySelector(select.booking.floorPlan);

    this.dom.phone = document.querySelector(select.booking.phone);
    this.dom.adress = document.querySelector(select.booking.address);
    this.dom.submit = document.querySelector(select.booking.submit);
    this.dom.filter = document.querySelector(select.booking.filter);
  }

  initWidgets() {
    // const thisBooking = this;

    this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
    this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);
    this.datePicker = new DatePicker(this.dom.datePicker);
    this.hourPicker = new HourPicker(this.dom.hourPicker);

    
    this.dom.wrapper.addEventListener('update',  () => {
      this.updateDOM();

    }); 
      
    this.dom.floorPlan.addEventListener('click', (e) => {
        
      e.preventDefault(); 
          
      const selectedTableData = e.target.getAttribute('data-table');
      console.log(selectedTableData);

          
      if(!e.target.classList.contains(classNames.booking.tableBooked) && !e.target.classList.contains(classNames.booking.tableSelected)){
        for(let table of this.dom.tables){
          table.classList.remove(classNames.booking.tableSelected);
        }
            
        e.target.classList.add(classNames.booking.tableSelected);
        this.selectedTable = selectedTableData;
    
      } else if(!e.target.classList.contains(classNames.booking.tableBooked) && e.target.classList.contains(classNames.booking.tableSelected)){
        e.target.classList.remove(classNames.booking.tableSelected);
      } else{
        alert(' The table is reserved');
      }
           
    }); 

    this.dom.filter.addEventListener('click', (e) =>{
      if(e.target.type === 'checkbox' && e.target.name === 'starter'){

        if(e.target.checked){
          this.starters.push(e.target.value);

        }else if (!e.target.checked){

          const indexOf = this.starters.indexOf(e.target.value);
          this.starters.splice(indexOf, 1);
        }
      }
    });


    this.dom.submit.addEventListener('click', (e) =>{
      e.preventDefault();

      this.sendBookingOrder();
    });
    
  } 

  sendBookingOrder() {

    const url = settings.db.url + '/' + settings.db.booking;

    const bookingForm = {
      date: this.date, 
      hour: this.hourPicker.value,
      table: parseInt(this.selectedTable),
      duration: parseInt(this.hoursAmountWidget.value),
      ppl: parseInt(this.peopleAmountWidget.value),
      starters: this.starters,
      phone: this.dom.phone.value,
      address: this.dom.adress.value,
    };



    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingForm),
    };

    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        this.booked = res;
        console.log('good');
      });


  }


  
}