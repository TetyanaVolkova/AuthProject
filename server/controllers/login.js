const Models = require('../models');
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.login = 
(req, res, next) => {
 let fetchUser;
 Models.Auth.findOne({
   where: { auth_email: req.body.userNameControl }
 })
 .then( user => {
   // console.log(user);
   if ( !user.dataValues ) {
     // res.son( "Auth faild" );
     return res.status(401).json({
       wessage: "Auth faild"
     })
   }
   fetchUser = user.dataValues;
   return bcrypt.compare(
     req.body.passwordControl, user.dataValues.auth_password
   );
 })
 .then(result => {
   if (!result) {
     return res.status(401).json({
       wessage: "Auth faild"
     })
   }
   const token = jwt.sign(
     {email: fetchUser.auth_email, userId: fetchUser.auth_id},
     'secret_thing_should_be_long_token_pass',
     {expiresIn: "1h"}
   );
   res.status(200).json({
     token: token,
     expiresIn: 3600
   });
 })
 .catch(err => {
   // res.json( "Auth faild" );
   return res.status(401).json({
   wessage: "Auth faild"
   })
 })
 //  req.session.isloggedIn = true;
 //  res.redirect('login');
}