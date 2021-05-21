const express = require('express');
const router = express.Router();
const passport = require('../passport');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  passport.authenticate('local-signup', function (err, user, info) {
    if (err) {
      return res.status(500).json({
        message: info.message
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info.message
      });
    }

    return res.json(user);
  })(req, res, next);
});

router.post('/signin', function (req, res, next) {
  passport.authenticate('local-signin', function (err, user, info) {
    if (err) {
      return res.status(500).json({
        message: info.message
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info.message
      });
    }

    try {
      const token = jwt.sign({
        user: user
      }, 'secret', {
        expiresIn: 3000
      });

      return res.cookie('token', token, {
        maxAge: 3000 * 1000
      }).end();
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

module.exports = router;