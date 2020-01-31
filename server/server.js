
const express = require( 'express' );
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
const cors = require( 'cors' );
const history = require( 'connect-history-api-fallback' );
const session = require( 'express-session' );
const passport = require( 'passport' );
const localStrategy = require( 'passport-local' ).Strategy;
const multer = require( 'multer' );
const flash = require( 'connect-flash' );
cookieParser = require('cookie-parser');

const debug = require("debug")("node-angular");
const http = require("http");
const helmet = require('helmet');
const compression = require('compression');

// Initialize dotenv to set up access to environmental variables
const dotenv = require( 'dotenv' );
dotenv.config();

const sequelize = require('./db')

const routes = require( './routes' );

const app = express();
app.use(express.json());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(cookieParser());

// Handle Sessions
// app.use(session({
//   secret: 'secret',
//   saveUninitialized: false,
//   resave: false,
//   cookie: {
//     path    : '/',
//     httpOnly: false,
//     maxAge  : 24*60*60*1000
//   }
// }));
// Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Apply middleware
app.use( cors());
app.use( bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "../server/dist/ticketing-system/images")));
app.use("/", express.static(path.join(__dirname, "../server/dist/ticketing-system")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    'Access-Control-Request-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,DELETE,PUT,PATCH"
  );
  next();
});

app.use( '/', routes );
// app.use( function( req, res, next ) {
//   if ( req.url=='/404' ){
//     res.status( 404 );
//   }
//   next();
// });
app.use( history());
app.use(helmet());
app.use(compression());
app.get( '*', ( req, res ) => {
  res.sendFile( path.join( __dirname, "../server/dist/ticketing-system/index.html" ));
});

const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;

  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

sequelize.sequelize.sync().then(result => {
  // console.log(result);
})
.catch(err => {
  console.log(err);
});


