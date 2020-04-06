var express = require('express');
var router = express.Router();

var user = require('../controllers/users.controllers'); 
var authentication= require('./authentication'); 

/*USER CRUD */
router.post('/signup', user.signup);
router.post('/login', user.login);

router.get('/:username', authentication, user.getUser); 
router.put('/:username', authentication, user.updateUser); 
router.put('/:username', authentication,  user.deactivateAccount);
router.delete('/:username',authentication, user.deleteUser); 

/*ROUTES TO GET EVERYTHING ELSE */

router.post('/verify-email', user.verifyEmail)

router.post('/follow', user.followUser)

module.exports = router;
