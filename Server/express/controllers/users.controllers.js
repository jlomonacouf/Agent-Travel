var sgMail = require('@sendgrid/mail');
var config = require('../config/config');
var randomatic = require('randomatic');

var s3Upload = require("./upload.controllers");
const bcrypt = require('bcrypt');
var con = require("../db");

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
    sgMail.send(msg).catch(function(err) {
        console.log(err);
    });
};

exports.signup = function(req, res)
{
    //Error Handling:
    var lengthConstraints = req.body.username.length > 30 || req.body.email.length > 45;
    if((req.body.firstname !== undefined && req.body.firstname.length > 20) || (req.body.lastname !== undefined && req.body.lastname.length > 30))
        lengthConstraints = false;

    if(req.body.username.match("/^[0-9a-zA-Z]+$/") === false && lengthConstraints === false)
        return res.json({success: false, message: "Bad input"});

    if(req.body.username === "" || req.body.email === "" || req.body.password === "$2a$10$hk5/mTXkwI9CJiWbLfpKC.7lEIs3/G7tA3x7NJ") //Checks if user, email, or password are empty
        return res.json({success: false, message: "Bad input"});

    var user = { 
        username: req.body.username, 
        email: req.body.email, 
        email_verified: 0, 
        password: req.body.password, 
        created_at: new Date() 
    };

    if(req.body.firstname !== undefined)
        user.firstname = req.body.firstname;
    if(req.body.lastname !== undefined)
        user.lastname = req.body.lastname;

    con.query('INSERT INTO Users SET ?', user, (err, results) => {
        if(err) 
            return res.json({success: false, message: "Sign up failed"});

        //Generate random code for user
        var emailCode = {
            user_id: results.insertId,
            email: user.email,
            code: randomatic('Aa0', 10),
            created_at: new Date() 
        };

        //Generate and insert email code into database whenever a new user is generated
        con.query('INSERT INTO EmailCode SET ?', emailCode, (err, res) => {
            if(err)
                return res.json({success: false, message: "Failed to create email verification"})
        });

        sendVerificationEmail(emailCode);
    });

    return res.json({success: true, message: "Account created successfully"})
};

exports.login = function(req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) 
    {
        console.log(con);
        con.query('SELECT * FROM Users WHERE username = ?', [username], function(error, results, fields) 
        {
            if(results.length === 0)
                return res.json({success: false, message: "Incorrect username or password"})

            if(bcrypt.compareSync(password, results[0].password) === true)
            {
				req.session.loggedin = true;
                req.session.username = username;
                req.session.userid = results[0].id;
                return res.json({success: true, message: "Successful login"})
            } 
            else 
            {
				return res.json({success: false, message: "Incorrect username or password"})
			}	
		});
    } 
    else 
    {
        return res.json({success: false, message: "Username or password not provided"})
	}
};

function updateEmailVerification(code, userid) //Returns true if it was able to properly update database
{
    console.log("Beginning transaction for user " + userid);
    con.beginTransaction(function(err) 
    {
        if (err) { return false; }

        console.log("Updating user to be verified");
        con.query('UPDATE Users SET email_verified = 1 WHERE id = ?', [userid], function(err, result) {
            if (err) { 
              con.rollback(function() {
                return false;
              });
            };
        });

        console.log("Deleting code from database");
        con.query('DELETE FROM EmailCode WHERE user_id = ? AND code = ?', [userid, code], function(err, result) {
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
   var userid = req.session.userid;

    if (username && code) 
    {
        con.query('SELECT * FROM EmailCode WHERE user_id = ? AND code = ?', [userid, code], function(error, results, fields) 
        {
            if (results.length > 0) 
            {
                if(updateEmailVerification(code, userid) === true)
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

function follow(userid, followId)
{
    con.beginTransaction(function(err) 
    {
        if (err) { return false; }

        //Update followers table
        con.query('INSERT INTO Followers VALUES (?, ?)', [userid, followId], function(error, result) {
            if (error) { 
              con.rollback(function() {
                return false;
              });
            };
        });

        //Update followed users follower count
        con.query('UPDATE Users SET followers = followers + 1 WHERE id = ?', [followId], function(error, result) {
            if (error) { 
              con.rollback(function() {
                return false;
              });
            };
        });

        //Update users following count
        con.query('UPDATE Users SET following = following + 1 WHERE id = ?', [userid], function(error, result) {
            if (error) { 
              con.rollback(function() {
                return false;
              });
            };
        });
    });

    con.commit();

    return true;
}

exports.followUser = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});
    
    var userid = req.session.userid;
    var followUsername = req.body.username;

    con.query("SELECT id FROM Users where username = ?", [followUsername], function(err, results) //Find id of the user being followed
    {
        if (err) { return res.json({success: false, message: "User not found"}); }

        var followId  = results[0].id;

        if(userid === followId) { return res.json({success: false, message: "Cannot follow user"}); } //User tries to follow him/her self

        if(follow(userid, followId) === false)
            return res.json({success: false, message: "Cannot follow user"});

        return res.json({success: true, message: "Successfully followed user"});
    })
}