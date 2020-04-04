exports.createItinerary = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});

    var userid = req.session.userid;
    var text = req.body.text;
    var country = req.body.country;
    var city = req.body.city;
    var region = req.body.region;

    //Fail cases:
    if(text === "")
        return res.json({success: false, message: "No text provided"})

    con.query("INSERT INTO Itineraries(user_id, text, created_at, country, city, region) VALUES (?, ?, ?, ?, ?, ?)", [userid, text, new Date(), country, city, region],  function(err)
    {
        if(err)
            return res.json({success: false, message: "Error creating itinerary"})

        return res.json({success: true, message: "Successful creation of itinerary"})
    })

    con.commit();
}

exports.deleteItinerary = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});

    var userid = req.session.userid;
    var itineraryID = req.body.itineraryID;

    con.query("SELECT user_id FROM Itineraries WHERE id = ?", itineraryID, function(err, results)
    {
        if(err)
            return res.json({success: false, message: "Error deleting itinerary"});

        if(results[0].user_id === userid)
        {
            con.query("DELETE FROM Itineraries WHERE id = ?", itineraryID, function(err) 
            {
                if(err)
                    return res.json({success: false, message: "Error deleting itinerary"});

                con.commit();

                return res.json({success: true, message: "Successfully deleted itinerary"});
            });
        }
        else
        {
            return res.json({success: false, message: "User is not authorized to perform this action"});
        }
    });

    con.commit();
}