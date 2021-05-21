const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./passport');
const cors = require('cors');
const {
  JWTSocketIOStrategy
} = require('./passport/JWTStrategy');

const PORT = process.env.PORT || 8080;
const log = console.log;

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.use(JWTSocketIOStrategy);
//io.use(cookieParser());

const conversationsRouter = require('./routes/conversations')(io);
const searchRouter = require('./routes/search')(io);
const usersRouter = require('./routes/users');
const contactsRouter = require('./routes/contacts');

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

/* For redirecting if client already has valid credentials when signing in or signing up */
const jwtAuthRedirect = (req, res, next) => {
  passport.authenticate('passport-jwt', function (err, user, info) {
    if (err) {
      return next();
    }

    if (!user) {
      return next();
    }

    return res.end();
  })(req, res, next);
}

/* For protecting routes */
const jwtAuthProtection = (req, res, next) => {
  passport.authenticate('passport-jwt', function (err, user, info) {
    if (err) {
      return next();
    }

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials!'
        }
      });
    }

    req.user = user;

    return next();
  })(req, res, next);
}

app.use('/conversations', jwtAuthProtection, conversationsRouter);
app.use('/contacts', jwtAuthProtection, contactsRouter);
app.use('/search', jwtAuthProtection, searchRouter);

app.use('/authentication', jwtAuthRedirect, usersRouter);

app.use(passport.initialize());



//app.use('/authentication', jwtAuth);

// app.all('/', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });

server.listen(PORT, () => {
  log(`Server is listening on PORT ${PORT}`);
})

module.exports = app;