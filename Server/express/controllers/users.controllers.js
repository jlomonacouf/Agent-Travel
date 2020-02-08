var sgMail = require('@sendgrid/mail');
var config = require('../config/config');
var mysql = require('mysql');
var randomatic = require('randomatic');

var s3Upload = require("./upload.controllers");

const con = mysql.createConnection({
    host: config.rdsDB.host,
    user: config.rdsDB.username,
    password: config.rdsDB.password,
    database: config.rdsDB.dbName
});
  
con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
});

//TO DO: Make verification email look good
function sendVerificationEmail(codeData)
{
    sgMail.setApiKey(process.env.SEND_GRID_API || config.sendGrid.key);
    const msg = {
        to: codeData.email,
        from: 'noreply@agent-travel.com',
        subject: 'Welcome to Agent Travel! Confirm your email.',
        text: 'Code: ' + codeData.code + "\nhttp://localhost:3000/verify-email?code=" + codeData.code + "&username=" + codeData.username
    };
    sgMail.send(msg);
};

exports.signup = function(req, res)
{
    var user = { 
        username: req.body.username, 
        email: req.body.email, 
        email_verified: 0, 
        password: req.body.password, 
        password_salt: req.body.password_salt, 
        created_at: new Date() 
    };

    if(req.body.firstname !== undefined)
        user.firstname = req.body.firstname;
    if(req.body.lastname !== undefined)
        user.lastname = req.body.lastname;

    con.query('INSERT INTO Users SET ?', user, (err, res) => {
        if(err) throw err;

        //Generate random code for user
        var emailCode = {
            username: user.username,
            email: user.email,
            code: randomatic('Aa0', 10),
            created_at: new Date() 
        };

        //Generate and insert email code into database whenever a new user is generated
        con.query('INSERT INTO EmailCode SET ?', emailCode, (err, res) => {
            if(err) throw err;
        });

        sendVerificationEmail(codeData);
    });

    return res.json({success: true, message: "Account created successfully"})
};

exports.login = function(req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) 
    {
        con.query('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) 
        {
            if (results.length > 0) 
            {
				req.session.loggedin = true;
                req.session.username = username;
                return res.json({success: true, message: "Successful login"})
            } 
            else 
            {
				return res.json({success: false, message: "Incorrect username or password"})
			}			
			res.end();
		});
    } 
    else 
    {
        return res.json({success: false, message: "Username or password not provided"})
	}
};

function updateEmailVerification(code, username) //Returns true if it was able to properly update database
{
    console.log("Beginning transaction for user " + username);
    con.beginTransaction(function(err) 
    {
        if (err) { return false; }

        console.log("Updating user to be verified");
        con.query('UPDATE Users SET email_verified = 1 WHERE username = ?', [username], function(err, result) {
            if (err) { 
              con.rollback(function() {
                return false;
              });
            };
        });

        console.log("Deleting code from database");
        con.query('DELETE FROM EmailCode WHERE username = ? AND code = ?', [username, code], function(err, result) {
            if (err) { 
              con.rollback(function() {
                return false;
              });
            };
        });
    });

    con.commit();

    return true;
}

exports.verifyEmail = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"})

   var code = req.body.code;
   var username = req.session.username;

    if (username && code) 
    {
        con.query('SELECT * FROM EmailCode WHERE username = ? AND code = ?', [username, code], function(error, results, fields) 
        {
            if (results.length > 0) 
            {
                if(updateEmailVerification(code, username) === true)
                {
                    console.log('success');
                    return res.json({success: true, message: "Successful verification"})
                }
            }
            else
            {
                return res.json({success: false, message: "Code not found for given username"})
            }
		});
    }
    else 
    {
        return res.json({success: false, message: "Username or code not provided"})
    }
};

exports.createItinerary = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"})

    //con.query()
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