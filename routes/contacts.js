const express = require('Express');
const router = express.Router();
const {
    getContacts,
    createInvitation
} = require('../database');

router.get('/', (req, res) => {
    if (!req.user) {
        return res.status(500).end();
    }

    getContacts(req.user).then(({
        contacts,
        sentInvitations,
        receivedInvitations
    }) => {
        return res.json({
            contacts: contacts,
            sentInvitations: sentInvitations,
            receivedInvitations: receivedInvitations
        });
    }).catch(error => {
        console.log(`error = ${JSON.stringify(error)}`);
    });
});

router.post('/invitation/send', (req, res) => {
    if (!req.user) {
        return res.status(400).end();
    }
    if (!req.body || !req.body.user) {
        return res.status(400).end();
    }

    createInvitation(req.user, req.body.user).then(() => {
        return res.json({
            success: 'success'
        });
    }).catch(error => {
        console.log(`error = ${JSON.stringify(error)}`);
        return res.json({
            failed: 'failed'
        });
    });
});

module.exports = router;