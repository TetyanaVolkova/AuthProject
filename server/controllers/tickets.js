const Models = require('../models');

exports.getTickets = 
( req, res ) => {
  let siteNumber = 0;
  let limit = +req.query.limit;;
  const pageIndex = +req.query.pageIndex;
  let filteredArray = [];
  let search;
  if ( req.query.searchString ) {
    search = req.query.searchString.toLowerCase();
  } else {
    search = '';
  }
  Models.Tickets.findAll({
  })
    .then((tickets) => {
      const allTicketsCount = tickets.length;
      const offset = pageIndex*limit;
      tickets.forEach( ticket => {
        if ( ticket.ticket_stage.includes(search ) || ticket.ticket_status.includes(search )) {
          filteredArray.push(ticket);
        }
      });
      let reverseTickets = filteredArray.slice().reverse();
      const ticketsCount = reverseTickets.length;
      filteredArray = reverseTickets;
      if( offset ) {
        filteredArray = reverseTickets.splice(offset, limit);
      }
      res.json( [filteredArray.map( m => m.dataValues ), ticketsCount, allTicketsCount] );
    })
    .catch( err => {
      console.error( err );
    });
}
exports.postTickets = 
    (req, res, next) => {
      const tickets = req.body;
      Models.Tickets.create( tickets )
      .then(result => {
        res.json( result.dataValues );
      })
      .catch(err => {
        console.log(err);
      });
    }

exports.updateTickets = 
(req, res, next) => {
  const ticket = req.body;
  Models.Tickets.findOne({
    where: { ticket_id: req.params.id }
  })
  .then(result => {
    result.ticket_stage = req.body.ticket_stage;
    return result.save()
    .then(result => {
      res.json( result.dataValues );
    })
  })
  .catch(err => {
    console.log(err);
  });
}