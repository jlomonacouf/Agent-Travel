var con = require("../db");

exports.getUserTrips = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    con.query('SELECT * FROM AgentTravel.Trips WHERE user_id = (SELECT id FROM AgentTravel.Users WHERE username = ?) ORDER BY start_date ASC;', [req.params.username], function(err, results) 
    {
        if(err)
            return res.json({success: false, message: "Error getting user trips"})
        
        return res.json({success: true, results});
    })
}

exports.getAllTrips = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    con.query('SELECT * FROM Trips', function(err, results) 
    {
        if(err)
            return res.json({success: false, message: "Error getting user trips"})
        
        return res.json({success: true, results});
    })
}

exports.getTripByID = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    con.query('SELECT * FROM Trips WHERE id = ?', [req.params.id], function(err, results) 
    {
        if(err)
            return res.json({success: false, message: "Error retrieving trip data"})

        con.query('SELECT l.*, t.start_date, t.end_date FROM AgentTravel.Trip_Location t JOIN AgentTravel.Location l ON t.location_id = l.id WHERE t.trip_id = ? ORDER BY t.start_date ASC', [req.params.id], function(err, locationResults) {
            if(err)
                return res.json({success: false, message: "Error retrieving trip data"})

            con.query('SELECT * FROM AgentTravel.Trip_Itinerary t JOIN (SELECT i.id, i.name, p.image_path FROM AgentTravel.Itineraries i JOIN AgentTravel.Photos p ON  p.itinerary_id = i.id GROUP BY i.id) a ON a.id = t.itinerary_id WHERE trip_id = ?', [req.params.id], function(err, itineraryResults) {
                if(err)
                    return res.json({success: false, message: "Error retrieving trip data"})

                results[0].location = locationResults;
                results[0].itineraries = itineraryResults;

                return res.json({success: true, results});
            })
        })
    })
}

function insertLocations(locations) {
    return new Promise ((finalResolve) => {
        var promises = [];
        locations.forEach(location => {
            promises.push( 
                new Promise((resolve) => {
                    con.query("CALL insertLocation(?, ?, ?, ?, ?)", [location.address, location.city, location.country, location.longitude, location.latitude], function(err, results) 
                    {
                        if(err)
                            resolve(false);
                        else
                            resolve(results[0][0].location_id);
                    })
                })
            )
        });

        Promise.all(promises).then((locationIDList) => {
            finalResolve(locationIDList);
            return;
        })
    })
}

exports.addItinerary = (req, res) => {
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    var tripItineraries = {
        trip_id: req.body.trip_id,
        locations: req.body.locations,
        itinerary_id: req.body.itinerary_id
    }

    con.query("SELECT user_id FROM Trips WHERE id = ?", req.body.trip_id, function(err, results) //Check if user created trip and has permission to delete it
    {
        if(err)
            return res.json({success: false, message: "Error adding plan to trip"});

        if(results[0] && results[0].user_id === req.session.userid)
        {
            var tripItinaryList = [];
            tripItineraries.locations.forEach((location, index) => {
                tripItinaryList.push([tripItineraries.trip_id, location, tripItineraries.itinerary_id])
            })

            con.query("INSERT IGNORE INTO Trip_Itinerary (trip_id, location_id, itinerary_id) VALUES ?", [tripItinaryList], function(err) 
            {
                if(err) {
                    console.log(err)
                    return res.json({success: false, message: "Error adding plan to trip"});
                }

                con.commit();

                return res.json({success: true, message: "Successfully added plan to trip"});
            });
        }
        else
        {
            return res.json({success: false, message: "Not authorized"});
        }
    });
}

exports.createTrip = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    var trip = {
        user_id: req.session.userid,
        name: req.body.name,
        start_date: req.body.dates[0].startDate,
        end_date: req.body.dates[req.body.dates.length-1].endDate,
        image_path: (req.body.image_path) ? req.body.image_path : "default path", 
        created_at: new Date()
    }

    var tags = req.body.tags;
    var locations = req.body.locations;
    var dates = req.body.dates;

    con.query("CALL insertTags(?, ?, ?, ?)", [tags.length, (tags[0]) ? tags[0] : "", (tags[1]) ? tags[1] : "", (tags[2]) ? tags[2] : ""], function(err, tagResults) 
    {
        if(err)
            return res.json({success: false, message: "Error creating trip"});

        var tagIDList = [tagResults[0][0].tag1_id, tagResults[0][0].tag2_id, tagResults[0][0].tag3_id];

        if(tagIDList[0] !== null)
            trip.tag1_id = tagIDList[0];
        if(tagIDList[1] !== null)
            trip.tag2_id = tagIDList[1];
        if(tagIDList[2] !== null)
            trip.tag3_id = tagIDList[2];

        insertLocations(locations).then((locationIDList) => {
            con.query("INSERT INTO Trips SET ?", [trip], function(err, tripResults) 
            {
                if(err)
                    return res.json({success: false, message: err});
                
                var tripId = tripResults.insertId;

                var tripLocationDates = [];

                for(var i = 0; i < locationIDList.length; i++)
                    tripLocationDates.push([tripId, locationIDList[i], dates[i].startDate, dates[i].endDate]);
                
                console.log(tripLocationDates);
                con.query("INSERT INTO Trip_Location (trip_id, location_id, start_date, end_date) VALUES ?", [tripLocationDates], function(err, tripResults) 
                {
                    if(err)
                        return res.json({success: false, message: err});

                    return res.json({success: true, message: "Successfully created trip"});
                })
            })
        });
    })

    con.commit();
}

exports.deleteTrip = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    var userid = req.session.userid;
    var tripID = req.body.tripID;

    con.query("SELECT user_id FROM Trips WHERE id = ?", tripID, function(err, results) //Check if user created trip and has permission to delete it
    {
        if(err)
            return res.json({success: false, message: "Error deleting trip"});

        if(results[0].user_id === userid)
        {
            con.query("DELETE FROM Trips WHERE id = ?", tripID, function(err) 
            {
                if(err)
                    return res.json({success: false, message: "Error deleting trip"});

                con.commit();

                return res.json({success: true, message: "Successfully deleted trip"});
            });
        }
        else
        {
            return res.json({success: false, message: "Not authorized"});
        }
    });

    con.commit();
}