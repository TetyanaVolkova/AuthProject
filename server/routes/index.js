const express = require( 'express' );
const Models = require('../models');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const checkAuth = require("../middleware/check-auth");

const LoginController = require("../controllers/login");
const RegisterController = require("../controllers/register");
const TicketsController = require("../controllers/tickets");
const CrssController = require("../controllers/crss");

// Routes:

// Registering new email
router.post("/register",
[check('auth_email').custom(email => {
  Models.Auth.findOne({
    where: { auth_email: req.body.userNameControl }
  })
  .then((auth) => {
    allEmails = auth.map( m => m.dataValues.auth_email );
    if (auth) {
      return Promise.reject('Email already registered')
    }
  })
  .catch( err => {
    console.error( err );
  });
})],
RegisterController.register);

// Login
router.post("/login", LoginController.login);

//Tickets
// Getting Tickets
router.get('/api/tickets_list',
  TicketsController.getTickets);

// Create new ticket
router.post("/api/tickets_list",
  TicketsController.postTickets
);

//Update Tickets
router.put("/api/tickets_list/:id",
  checkAuth,
  TicketsController.updateTickets
);

// Getting CRS list
router.get( '/api/crs_list', CrssController.getCrss);

// Getting Auth

// router.get( '/user', ( req, res ) => {
//   Models.Auth.findAll({
//   })
//     .then((auth) => {
//       // console.log(auth);
//       res.json(auth.map( m => m.dataValues ));
//     })
//     .catch( err => {
//       console.error( err );
//     });
// });

// router.delete("/api/tickets_list/:id",
// checkAuth,
// (req, res, next) => {
//   let num = Number(req.params.id);
//   Models.Tickets.destroy( {where: {'ticket_id': num}} )
//   .then(ticket => {
//     // ticket.destroy();
//   })
//   .catch(err => console.log(err));

//   res.status(200).json({ message: "Post deleted" });
// })

module.exports = router;
