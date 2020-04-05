var con = require("../db");

exports.createItinerary = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});

    var itinerary = {
        user_id: req.session.userid,
        name: req.body.name,
        text: req.body.text,
        created_at: new Date(),
        country: req.body.country,
        city: req.body.city,
        region: req.body.region,
    }

    //Fail cases:
    if(text === "")
        return res.json({success: false, message: "No text provided"})

    con.query("INSERT INTO Itineraries SET ? ", [itinerary],  function(err)
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
            return res.json({success: false, message: "Not authorized"});
        }
    });

    con.commit();
}

exports.uploadFile = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"})

    var params = {
        fileName: req.body.fileName,
        username: req.session.username
    };

    s3Upload.generatedUploadURL(params)
    
}