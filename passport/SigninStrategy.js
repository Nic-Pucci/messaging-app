const Strategy = require('passport-local').Strategy;
const findUserByEmail = require('../database').findUserByEmail;
const bcrypt = require('bcryptjs');

const strategyOptions = {
    usernameField: 'email'
};

const SigninStrategy = new Strategy(strategyOptions, async (email, password, done) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return done(null, false, {
            message: err
        })
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (validPassword) {
        delete user.password;
        return done(null, user);
    }

    return done(null, false, {
        message: 'Username/Email or password not valid.'
    });

});

module.exports = SigninStrategy;