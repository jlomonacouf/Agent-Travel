var passport = require('passport');

var User = require('../models/user.model');
var EmailCode = require('../models/emailcode.model');
var sgMail = require('@sendgrid/mail');
var config = require('../config/config')
var mysql = require('mysql')

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
    var user = { username: req.body.username, email: req.body.email, email_verified: 0, password: req.body.password, password_salt: '123', created_at: '1/2/1999' };
    if(req.body.firstname !== undefined)
        user.firstname = req.body.firstname;
    if(req.body.lastname !== undefined)
        user.lastname = req.body.lastname;

    con.query('INSERT INTO Users SET ?', user, (err, res) => {
        if(err) throw err;

        console.log('Last insert ID:', res.insertId);
    });

    /*User.register(new User({username: req.body.username, email: req.body.email, email_verified : false}), req.body.password)
    .then((user) =>
    {
        var randomatic = require('randomatic')
        var codeData = {
            "username": user.username,
            "email": user.email,
            "code" : randomatic('Aa0', 10)
        }

        sendVerificationEmail(codeData)

        var code = new EmailCode(codeData)
        return code.save()
    })
    .then(() =>
    {
        goodRequest(res)
    })
    .catch((err) => {
        console.log('Error during user registration!', err);
        res.json({message: err})
    });*/
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