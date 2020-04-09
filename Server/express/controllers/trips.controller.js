var con = require("../db");

exports.getUserTrips = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    con.query('SELECT id FROM Users WHERE username = ?', [req.params.username], function(err, idResults) 
    {
        if(err)
            return res.json({success: false, message: "Error getting user trips"})
        
        if(idResults.length !== 0)
        {
            con.query('SELECT * FROM Trips WHERE user_id = ?', [idResults[0].id], function(err, results) 
            {
                if(err)
                    return res.json({success: false, message: "Error getting user trips"})
                
                return res.json({success: true, results});
            })
        }
        else
            return res.json({success: false, message: "User not found"})
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
            return res.json({success: false, message: "Error getting user trips"})
        
        return res.json({success: true, results});
    })
}

exports.createTrip = (req, res) =>
{
    if(req.session.loggedin === false || req.session.loggedin === undefined)
        return res.json({success: false, message: "Not authorized"});

    var trip = {
        user_id: req.session.userid,
        name: req.body.name,
        created_at: new Date(),
    }
    
    if(req.body.start_date)
        trip.start_date = req.body.start_date;
    if(req.body.end_date)
        trip.end_date = req.body.end_date;


    con.query("INSERT INTO Trips SET ? ", [trip],  function(err)
    {
        if(err)
            return res.json({success: false, message: "Error creating trip"})

        return res.json({success: true, message: "Successful creation of trip"})
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