var con = require("../db");

exports.createTrip = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});

    var trip = {
        user_id: req.session.userid,
        name: req.body.name,
        created_at: new Date(),
    }

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
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});

    var userid = req.session.userid;
    var tripID = req.body.tripID;

    con.query("SELECT user_id FROM Trips WHERE id = ?", tripID, function(err, results)
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