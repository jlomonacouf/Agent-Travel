var express = require('express');
var router = express.Router();

var itinerary = require('../controllers/itineraries.controller')

router.post('/create-itinerary', itinerary.createItinerary)

router.post('/delete-itinerary', itinerary.deleteItinerary)

module.exports = router;
