var express = require('express');
var router = express.Router();

var user = require('../controllers/users.controllers')

router.post('/signup', user.signup);

router.post('/login', user.login);

router.post('/verify-email', user.verifyEmail)

module.exports = router;
