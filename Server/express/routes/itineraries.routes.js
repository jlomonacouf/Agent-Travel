var express = require('express');
var router = express.Router();

var itinerary = require('../controllers/itineraries.controller')

router.get('/get/:username', itinerary.getUserItineraries); 
/* No parameters - Returns all trips created by a user */

router.get('/get-all-itineraries', itinerary.getAllItineraries); 
/* No parameters - Returns all trips in the database */

router.get('/get-by-id/:id', itinerary.getItineraryByID); 
/* No parameters - Returns all trips in the database */

router.post('/get-relevant', itinerary.getRelevantItineraries)

router.post('/create-itinerary', itinerary.createItinerary);

router.post('/delete-itinerary', itinerary.deleteItinerary);

router.post('/like-itinerary', itinerary.likeItinerary);
/*
Parameters
itinerary_id - int
*/

router.post('/dislike-itinerary', itinerary.dislikeItinerary);
/*
Parameters
itinerary_id - int
*/

module.exports = router;
