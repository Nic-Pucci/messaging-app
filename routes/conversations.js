const express = require('express');
const router = express.Router();
const {
  createNewMessage,
  createNewConversation,
  findConversationsByCreatorID,
  deleteConversation
} = require('../database');

router.get('/', async (req, res) => {
  const userID = req.user.id;
  if (!userID) {
    return res.status(400).end();
  }

  const conversations = await findConversationsByCreatorID(userID);
  return res.json({
    conversations
  });
});

router.post('/conversation', function (req, res) {
  const newConversation = req.body.conversation;
  if (!newConversation) {
    return res.status(400).end()
  }

  createNewConversation(newConversation).then(conversation => {
    return res.json({
      conversation
    });
  }).catch(error => {
    return res.json(error);
  });
});

module.exports = function (io) {
  io.on('connection', (socket) => {
    err => console.log('on socket connection');

    socket.on('create message', ({
      message
    }) => {
      console.log('new message received: ' + JSON.stringify(message));

      createNewMessage(message).then(message => {
        io.emit('new message', {
          message: message
        });
      }).catch(error => {
        console.log(`error = ${JSON.stringify(error)}`);
      });

    });

    socket.on('create conversation', ({
      conversation
    }) => {
      console.log('new conversation received: ' + JSON.stringify(conversation));

      createNewConversation(conversation).then(conversation => {
        socket.emit('new conversation', {
          conversation: conversation
        });
      }).catch(error => {
        console.log(`error = ${JSON.stringify(error)}`);
      });

    });

    socket.on('delete conversation', ({
      conversation
    }) => {
      console.log('new conversation to delete received: ' + JSON.stringify(conversation));

      deleteConversation(conversation).then(conversation => {
        socket.emit('deleted conversation', {
          conversation: conversation
        });
      }).catch(error => {
        console.log(`error = ${JSON.stringify(error)}`);
      });

    });
  });

  io.on('disconnect', () => {
    console.log('test n')
  });

  return router;
};