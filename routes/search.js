const express = require('Express');
const {
    response
} = require('../app');
const router = express.Router();
const {
    getUsersBySearchQuery
} = require('../database');


module.exports = (io) => {
    io.on('connection', (socket) => {
        err => console.log('on socket connection');

        socket.on('search users', async ({
            searchQuery
        }) => {
            if (!searchQuery || searchQuery.length === 0) {
                io.emit('search users results', {
                    users: []
                });
                return;
            }

            console.log('new search query received: ' + JSON.stringify(searchQuery));

            const users = await getUsersBySearchQuery(searchQuery, socket.handshake.user);
            io.emit('search users results', {
                users: users || []
            });
        });
    });

    io.on('disconnect', () => {
        console.log('test n')
    });

    return router;
};