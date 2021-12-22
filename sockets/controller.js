const TiketControl = require('../models/tiket-control.js');
const ticketControl = new TiketControl();

const socketController = (socket) => {
  //Cuando un cliente se conecta
  socket.emit('utlimo-tiket', ticketControl.ultimo);
  socket.emit('tickets-pendientes', ticketControl.tikets.length);
  socket.emit('estado-actual', ticketControl.ultimos4)

  socket.on('disconnect', () => {});

  socket.on('next-ticket', (payload, callback) => {
    //   console.log(payload);
    //Si se envia el callback es posible emitirlo a traves de un objeto es decir es como hacer una peticion http pero usando socketes ya que se puede hacer uso de async await y en el parametro del callback enviar el objto resultante
    
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tikets.length);
  });

  socket.on('atender-ticket', ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio',
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);
    socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tikets.length);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tikets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: 'Ya no hay tickets pendients',
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
