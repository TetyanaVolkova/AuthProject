const Models = require('../models');
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

let allEmails;

exports.register = 
(req, res, next) => {
bcrypt.hash(req.body.auth_password, 10)
.then(hash => {
  req.body.auth_password = hash;
  const user = req.body;
  Models.Auth.findOne({
    where: { auth_email: req.body.auth_email }
  })
  .then( result => {
    if( !result ) {
      Models.Auth.create( user )
      .then(result => {
        res.json( result.dataValues );
      })
      .catch(err => {
        console.log(err);
      })
    } else res.json( "Email already registered" )
  })
});

}