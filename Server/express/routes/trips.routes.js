var express = require('express');
var router = express.Router();

var trip = require('../controllers/trips.controller')

router.post('/create-trip', trip.createTrip)

router.post('/delete-trip', trip.deleteTrip)

module.exports = router;
