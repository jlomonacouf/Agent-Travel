const sgMail = require('@sendgrid/mail');
const config = require('../config/config');
//var jwt  = require('jsonwebtoken'); 

const randomatic = require('randomatic');
const S3Upload = require('../S3Upload');
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

exports.uploadProfilePhoto = function (req, res)
{
    //if(req.session.loggedin === false || req.session.loggedin === undefined)
    //    return res.json({success: false, message: "Not authorized"});

    S3Upload.generateUploadURL(req.session.username).then((data) => {
        res.json({success: true, data: data})
    })
}

exports.signup = function(req, res)
{
    //Error Handling:
    var lengthConstraints = req.body.username.length > 30 || req.body.email.length > 45;
    if((req.body.firstname !== undefined && req.body.firstname.length > 20) || (req.body.lastname !== undefined && req.body.lastname.length > 30))
        lengthConstraints = false;

    if(req.body.username.match("/^[0-9a-zA-Z]+$/") === false && lengthConstraints === false)
        return res.json({success: false, message: "Bad input"});

    if(req.body.username === "" || req.body.email === "" || req.body.password === "") //Checks if user, email, or password are empty
        return res.json({success: false, message: "Bad input"});

    var hash = bcrypt.hashSync(req.body.password, 10); 

    var user = { 
        username: req.body.username, 
        first_name: (req.body.first_name === undefined) ? "" : req.body.first_name,
        last_name: (req.body.last_name === undefined) ? "" : req.body.last_name,
        email: req.body.email, 
        email_verified: 0, 
        phone_number: (req.body.phone_number === undefined) ? "" : req.body.phone_number,
        password: hash, 
        public: (req.body.public === undefined) ? 1 : req.body.public,
        avatar_path: (req.body.public === undefined) ? 'data:image/png;base64,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': req.body.avatar_path, 
        created_at: new Date() 
    };

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
        con.query('INSERT INTO EmailCode SET ?', emailCode, (err, emailResults) => {
            if(err)
                return res.json({success: false, message: "Failed to create email verification"})
            
            sendVerificationEmail(emailCode);
            return res.json({success: true, message: "Account created successfully"})
        });
    });
  

    con.commit();
    /*jwt.sign(user, config.secretKey, {
        algorithm: config.algorithm,
        expiresIn: '8h'
    },(err, token)=>{
        if(err) {console.log(err)}
        return res.json({success: true, message: "Account created successfully", jwtoken: token}); 
    });*/
   // return res.json({success: true, message: "Account created successfully", jwtoken: token}) 
};

exports.login = function(req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) 
    {
        console.log(con);
        con.query('SELECT * FROM Users WHERE username = ?', [username], function(error, results, fields) 
        {
            //console.log(results);
            //console.log(password); 

            if(results.length === 0)
                return res.json({success: false, message: "Incorrect username or password"})
            

            if(bcrypt.compareSync(password, results[0].password) === true)
            {
				req.session.loggedin = true;
                req.session.username = username;
                req.session.userid = results[0].id;

                
                /*jwt.sign(username, config.secretKey, {
                    algorithm: config.algorithm,
                    expiresIn: '8h'
                },(err, token)=>{
                    if(err) {console.log(err)}
                    return res.json({success: true, message: "Successful login", jwtoken: token})
                });*/

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


exports.getUser = function(req, res) {

    var username=req.params.username; 

    con.query('SELECT id, username, first_name, last_name, email, email_verified, phone_number, public, followers, following, avatar_path FROM Users WHERE username = ?', [username], function(error, results, fields) 
    {
        if(error) {
            console.log(error); 
            return res.json({success: false, message: "Error occured"});
        }

        if(results.length === 0){
            return res.json({success: false, message: "Can't find user"}); 
        } 
        else 
        {
            var id = results[0].id;
            delete results[0].id;

            if(req.session.userid === undefined && results[0].public === true)
                return res.json({success: true, results}); 

            isFollowing(req.session.userid, id).then((val) => { //Check if user requesting information follows other user
                results[0].follows = val;

                isFollowing(id, req.session.userid).then((val) => { //Check if other user follows the user requesting information
                    results[0].followsMe = val;

                    if(results[0].public === true || req.session.userid === id || results[0].follows === true)
                    {
                        return res.json({success: true, results}); 
                    }
                    else
                    {
                        return res.json({success: false, message: "This account is private"}); 
                    }
                })
            })
        }	
    });
}; 

exports.updateUser= function(req, res) {
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"})

    var user = {};

    if(req.body.first_name !== undefined)
        user.first_name = req.body.first_name;
    if(req.body.last_name !== undefined)
        user.last_name = req.body.last_name;
    if(req.body.phone_number !== undefined)
        user.phone_number = req.body.phone_number;
    if(req.body.public !== undefined)
        user.public = (req.body.public === "1") ? 0b1 : 0b0;

    if(req.body.password !== undefined)
    {
        if(req.body.password === "") //Checks if password is empty
            return res.json({success: false, message: "Bad input"});

        user.password = bcrypt.hashSync(req.body.password, 10); 
    }

    con.query('UPDATE Users SET ? WHERE id = ?', [user, req.session.userid], function(error, results, fields) 
    {
        if(error) {
            console.log(error); 
            return res.json({success: false, message: "Error occured"});
        }

        if(results.length === 0){
            return res.json({success: false, message: "Can't find user"}); 
        } 
        else 
        {
            console.log(results); 
            console.log(fields); 
            return res.json({success: true, message: "Updated user"}); 
        }	
    });

    con.commit();
}; 

/*exports.deactivateAccount= function( req, res){
//Deactivate user account, do not actually delete. 


};*/ 

function deleteUserTransaction(userid)
{
    console.log("Beginning deletion transaction for user " + userid);
    con.beginTransaction(function(err) 
    {
        if (err) { return false; }

        console.log("Deleting code from database");
        con.query('DELETE FROM EmailCode WHERE user_id = ?', [userid], function(err, result) {
            if (err) { 
            con.rollback(function() {
                return false;
            });
            };
        });

        console.log("Deleting user from database");
        con.query('DELETE FROM Users WHERE id = ?', [userid], function(err, result) {
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

exports.deleteUser = function (req,res){
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"})

    if(deleteUserTransaction(req.session.userid) === true)
        return res.json({success: true, message: "Successfully deleted user"})
    else
        return res.json({success: false, message: "Unabled to delete user"})
};

function updateEmailVerification(code, userid) //Returns true if it was able to properly update database
{
    console.log("Beginning transaction for user " + userid);
    con.beginTransaction(function(err) 
    {
        if (err) { return false; }

        console.log("Updating user to be verified");
        con.query('UPDATE Users SET email_verified = ' + 0b1 + ' WHERE id = ?', [userid], function(err, result) {
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

function isFollowing(userid, followId)
{
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM Followers WHERE user1_id = ? AND user2_id = ?", [userid, followId], function(err, results) //Find id of the user being followed
        {
            if (err) { 
                console.log("An error occurred while searching for followers\n" + err); 
                resolve(false);
            }

            if(results.length > 0)
                resolve(true);
            else
                resolve(false);
        })
    })
}

exports.isFollowingUser = (req, res) => {
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});
    
    con.query('SELECT id FROM Users WHERE username = ?', [req.body.followUsername], function(error, results, fields) 
    {
        if(error)
            return res.json({success: false, message: "An error occurred searching for user"});
        
        if(results.length === 0)
            return res.json({success: false, message: "User not found"});

        isFollowing(req.session.userid, results[0].id).then((val) => {
            if(val === true)
                return res.json({success: true, isFollowing: true});
            else
                return res.json({success: true, isFollowing: false});
        })
    })
}

function follow(userid, followId)
{
    return new Promise((resolve, reject) => {
        isFollowing(userid, followId).then((val) => {
            if(val === true)
            {
                resolve(false);
                return;
            }

            con.beginTransaction(function(err) 
            {
                if (err) { resolve(false); }
        
                //Update followers table
                con.query('INSERT INTO Followers VALUES (?, ?)', [userid, followId], function(error, result) {
                    if (error) { 
                        con.rollback(function() {
                            resolve(false);
                            return;
                        });
                    };
                });
        
                //Update followed users follower count
                con.query('UPDATE Users SET followers = followers + 1 WHERE id = ?', [followId], function(error, result) {
                    if (error) { 
                        con.rollback(function() {
                            resolve(false);
                            return;
                        });
                    };
                });
        
                //Update users following count
                con.query('UPDATE Users SET following = following + 1 WHERE id = ?', [userid], function(error, result) {
                    if (error) { 
                        con.rollback(function() {
                            resolve(false);
                            return;
                        });
                    };
                });
            });
        
            con.commit();
        
            resolve(true);
        });
    });
}

exports.followUser = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});
    
    var followUsername = req.body.followUsername;
    var userid = req.session.userid;

    con.query("SELECT id FROM Users where username = ?", [followUsername], function(err, results) //Find id of the user being followed
    {
        if (err || results.length === 0) { return res.json({success: false, message: "User not found"}); }

        var followId  = results[0].id;

        if(userid === followId) { return res.json({success: false, message: "Cannot follow user"}); } //User tries to follow him/her self

        follow(userid, followId).then((val) => {
            if(val === true)
                return res.json({success: true, message: "Successfully followed user"});
            else
                return res.json({success: false, message: "Cannot follow user"});
        });
    })
}

function unfollow(userid, followId)
{
    return new Promise((resolve, reject) => {
        isFollowing(userid, followId).then((val) => {
            if(val === false)
            {
                resolve(false);
                return;
            }

            con.beginTransaction(function(err) 
            {
                if (err) { resolve(false); }
        
                //Update followers table
                con.query('DELETE FROM Followers WHERE user1_id = ? AND user2_id = ?', [userid, followId], function(error, result) {
                    if (error) { 
                        con.rollback(function() {
                            resolve(false);
                            return;
                        });
                    };
                });
        
                //Update followed users follower count
                con.query('UPDATE Users SET followers = followers - 1 WHERE id = ?', [followId], function(error, result) {
                    if (error) { 
                        con.rollback(function() {
                            resolve(false);
                            return;
                        });
                    };
                });
        
                //Update users following count
                con.query('UPDATE Users SET following = following - 1 WHERE id = ?', [userid], function(error, result) {
                    if (error) { 
                        con.rollback(function() {
                            resolve(false);
                            return;
                        });
                    };
                });
            });
        
            con.commit();

            resolve(true);
        });
    });
}

exports.unfollowUser = (req, res) =>
{
    if(!req.session.loggedin)
        return res.json({success: false, message: "Not authorized"});
    
    var followUsername = req.body.followUsername;
    var userid = req.session.userid;

    con.query("SELECT id FROM Users where username = ?", [followUsername], function(err, results) //Find id of the user being followed
    {
        if (err || results.length === 0) { return res.json({success: false, message: "User not found"}); }

        var followId  = results[0].id;

        if(userid === followId) { return res.json({success: false, message: "Cannot unfollow user"}); } //User tries to unfollow him/her self

        unfollow(userid, followId).then((val) => {
            if(val === true)
                return res.json({success: true, message: "Successfully unfollowed user"});
            else
                return res.json({success: false, message: "Cannot unfollow user"});
        });
    })
}

function canGetUserInformation(req, username)
{
    return new Promise((resolve, reject) => {
        con.query('SELECT id, public FROM Users WHERE username = ?', [username], function(error, results, fields) 
        {
            if(error) {
                console.log(error); 
                reject(false);
                return;
            }

            if(results.length === 0){ //Check if user exists
                resolve(false);
                return;
            } 
            else 
            {
                var id = results[0].id;
                delete results[0].id;

                if(results[0].public === true || req.session.userid === id)
                {
                    resolve(true);
                    return;
                }

                isFollowing(req.session.userid, id).then((val) => { //Check if user requesting information follows other user

                    if(results[0].public === true || req.session.userid === id || val === true)
                    {
                        resolve(true);
                        return; 
                    }
                    else
                    {
                        resolve(false);
                        return;
                    }
                })
            }	
        });
    })
}

exports.getFollowing = (req, res) => {
    var username=req.params.username; 
    canGetUserInformation(req, username).then((canGet) => {
        if(canGet)
        {
            con.query('SELECT username FROM Users WHERE id in (SELECT user2_id FROM (SELECT id FROM Users WHERE username = ?) a JOIN Followers on a.id = Followers.user1_id);', [username], function(error, results, fields) 
            {
                if(error)
                    return res.json({success: false, message: "Could not retrieve users being followed"});

                return res.json({success:true, results})
            })
        }
        else
        {
            return res.json({success: false, message: "User is private"});
        }
    }).catch(() => {
        return res.json({success: false, message: "Error retrieving user information"});
    })
}

exports.getFollowers = (req, res) => {
    var username=req.params.username; 
    canGetUserInformation(req, username).then((canGet) => {
        if(canGet)
        {
            con.query('SELECT username FROM Users WHERE id in (SELECT user1_id FROM (SELECT id FROM Users WHERE username = ?) a JOIN Followers on a.id = Followers.user2_id);', [username], function(error, results, fields) 
            {
                if(error)
                    return res.json({success: false, message: "Could not retrieve user followers"});

                return res.json({success:true, results})
            })
        }
        else
        {
            return res.json({success: false, message: "User is private"});
        }
    }).catch(() => {
        return res.json({success: false, message: "Error retrieving user information"});
    })
}