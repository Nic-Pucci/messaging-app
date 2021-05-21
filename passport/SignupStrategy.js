const Strategy = require('passport-local').Strategy;
const createUser = require('../database').createUser;
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


const SignupStrategy = new Strategy({
    passReqToCallback: true
}, function (req, username, password, done) {

    const email = req.body.email;
    const bio = req.body.bio;
    const encryptedPassword = bcrypt.hashSync(password, salt);

    createUser(username, encryptedPassword, email, bio).then((user) => {
        delete user.password;
        return done(null, user);
    }).catch((err) => {
        return done(null, false, {
            message: err
        })
    });
});

module.exports = SignupStrategy;