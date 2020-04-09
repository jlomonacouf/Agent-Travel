var express = require('express');
var router = express.Router();

var user = require('../controllers/users.controllers'); 
//var authentication= require('./authentication'); 

/*USER CRUD */
router.post('/signup', user.signup);
/* 
Parameters
username - string (unique)
first_name - string (optional)
last_name - string (optional)
email: - string (unique)
phone_number - string (optional)
password - string
public - 0 or 1 (optional)
*/

router.post('/login', user.login);
/* 
Parameters
username - string
password - string
*/

router.delete('/deleteUser', user.deleteUser);
/* No parameters */

router.put('/updateAccount', user.updateUser);
/*
Parameters
first_name - string (optional)
last_name - string (optional)
phone_number - string (optional)
public - 1 or 0 (optional)
*/

router.get('/:username', user.getUser); 
/* No parameters */

/*ROUTES TO GET EVERYTHING ELSE */

router.post('/verify-email', user.verifyEmail)
/*
Parameters
code - string
*/

router.post('/follow', user.followUser)
/*
Parameters
followUsername - string
*/

router.post('/unfollow', user.unfollowUser)
/*
Parameters
followUsername - string
*/

module.exports = router;


/*router.put('/:username', authentication, user.updateUser); 
router.put('/:username', authentication,  user.deactivateAccount);
router.delete('/:username',authentication, user.deleteUser);*/