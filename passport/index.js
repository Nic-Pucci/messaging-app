const passport = require('passport');
const SignupStrategy = require('./SignupStrategy');
const SigninStrategy = require('./SigninStrategy');
const JWTStrategy = require('./JWTStrategy').JWTStrategy;
//const GoogleStrategy = require('./GoogleStrategy');
//const GithubStrategy = require('./GithubStrategy');

/* register strategies into passport */
passport.use('local-signin', SigninStrategy);
passport.use('local-signup', SignupStrategy);
passport.use('passport-jwt', JWTStrategy);

module.exports = passport;