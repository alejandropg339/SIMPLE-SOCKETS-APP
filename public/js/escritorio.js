const searchParams = new URLSearchParams(window.location.search);

//HTML REFERENCES
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblPendientes = document.querySelector('#lblPendientes');
const lblticket = document.querySelector('small');
const without = document.querySelector('#without');


if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
// without.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;


});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;

});


socket.on('tickets-pendientes', (tickets)=> {
    console.log(tickets);
    lblPendientes.innerText = tickets;
    validateTickets(tickets);
});

const validateTickets = (tickets)=>{
    if(tickets > 0){
        without.style.display = 'none';
        lblPendientes.style.display = '';
    }else if(tickets === 0){
        without.style.display = '';
        lblPendientes.style.display = 'none';
    }else{
        lblPendientes.style.display = 'none';
    }
}

btnAtender.addEventListener( 'click', () => {
    
    socket.emit('atender-ticket', { escritorio }, ({ok, ticket, msg })=>{
        if(!ok){
            lblticket.innerText='Nadie'
            return without.style.display = '';
        }

        lblticket.innerText='Ticket ' + ticket.numero

    })
    
    // socket.emit( 'next-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});

