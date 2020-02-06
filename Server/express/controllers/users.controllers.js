var User = require('../models/user.model');
var EmailCode = require('../models/emailcode.model');
var sgMail = require('@sendgrid/mail');
var config = require('../config/config')
var mysql = require('mysql')
var randomatic = require('randomatic')

const con = mysql.createConnection({
    host: config.rdsDB.host,
    user: config.rdsDB.username,
    password: config.rdsDB.password,
    database: 'AgentTravel'
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
    sgMail.setApiKey(process.env.SEND_GRID_API || require('../config/config').sendGrid.key);
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

        console.log('Last insert ID:', res.insertId);

        //Generate random code for user
        var emailCode = {
            username: user.username,
            email: user.email,
            code: randomatic('Aa0', 10),
            created_at: new Date() 
        }

        sendVerificationEmail(codeData)

        //Generate and insert email code into database whenever a new user is generated
        con.query('INSERT INTO EmailCode SET ?', emailCode, (err, res) => {
            if(err) throw err;
        });
    });
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
                res.send('Successful login');
            } 
            else 
            {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
    } 
    else 
    {
		res.send('Please enter Username and Password!');
		res.end();
	}
};

exports.verifyEmail = (req, res) =>
{
    EmailCode.findOne({code: req.body.code, username: req.body.username})
    .then((code) =>
    {
        if (code == null)
            return errorRequest(res, "MissingCode", "The requested code does not exist for this user.")

        User.findOne({username: code.username})
        .then((user) =>
        {
            if (user == null)
                return errorRequest(res, "MissingUser", "The user attached to the code no longer exists.")

            return User.update({"username": user.username},
            {
                "email": code.email,
                "email_verified" : true
            })
        })
        .then(() =>
        {
            return code.remove()
        })
        .then(() =>
        {
            return goodRequest(res)
        })

    })
};

function goodRequest(res)
{
    return res.json({
        message: {"name": "success"},
        user: res.user
    })
};

function errorRequest(res, type, message)
{
    return res.json({"message": {"name": type, "message": message}})
};