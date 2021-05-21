const {
    Strategy
} = require('passport-jwt');
const SocketIOStrategy = require('passport-jwt.socketio');
const findUserByID = require('../database').findUserByID;

const options = {
    usernameField: 'id',
    jwtFromRequest: req => {
        return req.cookies.token;
    },
    secretOrKey: 'secret'
    // issuer: 'accounts.examplesoft.com',
    // audience: 'yoursite.net'
};

const socketIOOptions = {
    jwtFromRequest: req => {
        return req._query.token;
    },
    secretOrKey: 'secret'
    // issuer: 'accounts.examplesoft.com',
    // audience: 'yoursite.net'
};

const JWTStrategy = new Strategy(options, async (jwtPayload, done) => {
    if (!jwtPayload.user || !jwtPayload.user.id) {
        done(null, false);
    }

    const id = jwtPayload.user.id;
    const user = await findUserByID(id);
    if (user) {
        delete user.password;
        return done(null, user);
    }

    return done(null, false, {
        message: 'User is not valid.'
    });
});

const JWTSocketIOStrategy = SocketIOStrategy.authorize(socketIOOptions, async (jwtPayload, done) => {
    if (!jwtPayload.user || !jwtPayload.user.id) {
        done(null, false);
    }

    const id = jwtPayload.user.id;
    const user = await findUserByID(id);
    if (user) {
        delete user.password;
        return done(null, user);
    }

    return done(null, false, {
        message: 'User is not valid.'
    });
});

module.exports = {
    JWTStrategy,
    JWTSocketIOStrategy
};