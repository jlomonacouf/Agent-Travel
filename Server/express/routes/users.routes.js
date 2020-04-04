var express = require('express');
var router = express.Router();

var user = require('../controllers/users.controllers')

router.post('/signup', user.signup);

router.post('/login', user.login);

router.post('/verify-email', user.verifyEmail)

router.post('/get-salt', user.getSalt)

router.post('/follow', user.followUser)

router.post('/create-itinerary', user.createItinerary)

router.post('/delete-itinerary', user.deleteItinerary)

module.exports = router;
