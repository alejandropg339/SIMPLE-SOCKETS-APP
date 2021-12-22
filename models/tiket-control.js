const path = require('path');
const fs = require('fs');


class Ticket {
  constructor(numero, escritorio){
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketContol {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tikets = [];
    this.ultimos4 = [];

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tikets: this.tikets,
      ultimos4: this.ultimos4,
    };
  }

  init(){
      const {hoy, tikets,ultimos4, ultimo} = require('../db/data.json');
      if(this.hoy === hoy){
        this.tikets = tikets;
        this.ultimo = ultimo;
        this.ultimos4 = ultimos4;
      }else{
        this.guardarDB();
      }
  }

  guardarDB(){

    const dbPath = path.join(__dirname, '../db/data.json');
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson))

  }

  siguiente(){
    this.ultimo += 1;
    const tiket = new Ticket(this.ultimo, null);
    this.tikets.push( tiket );
    this.guardarDB();

    return 'Tiket ' + tiket.numero;
  }

  atenderTicket( escritorio ){
    //No tenemos más tickets
    if(this.tikets.length === 0){
      return null
    }

    const ticket = this.tikets.shift();

    ticket.escritorio = escritorio;

    this.ultimos4.unshift(ticket);

    if(this.ultimos4.length > 4){
      this.ultimos4.splice(-1,1);
    }

    this.guardarDB();

    return ticket;
    
  }
}

module.exports = TicketContol;
