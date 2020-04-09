var express = require('express');
var router = express.Router();

var trip = require('../controllers/trips.controller')

router.get('/get/:username', trip.getUserTrips); 
/* No parameters - Returns all trips created by a user */

router.get('/get-all-trips', trip.getAllTrips); 
/* No parameters - Returns all trips in the database */

router.get('/get-by-id/:id', trip.getTripByID); 
/* No parameters - Returns all trips in the database */

router.post('/create-trip', trip.createTrip)
/* 
Parameters
name - string
start_date - date (optional)
end_date - date (optional)
*/

router.post('/delete-trip', trip.deleteTrip)
/* 
Parameters
tripID - int
*/

module.exports = router;
