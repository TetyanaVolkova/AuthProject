const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, "secret_thing_should_be_long_token_pass");
    next();
  } catch (error) {
    res.status(401).json( {message: "Auth failed!"} )
  }
};
