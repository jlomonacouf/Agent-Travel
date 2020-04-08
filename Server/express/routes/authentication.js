/*var express = require('express');
var router = express.Router();
var config = require('../config/config');
var jwt = require('jsonwebtoken');



router.use(function (req, res, next) {
    var token = req.headers['jwtoken']; 
    console.log(token);
    console.log(config.secretKey);
    console.log(config.algorithm);
    if (token) {
        jwt.verify(token, config.secretKey,
            {
                algorithm: config.algorithm

            }, function (err, decoded) {
                if (err) {
                    let errordata = {
                        message: err.message,
                        expiredAt: err.expiredAt
                    };
                    console.log(errordata);
                    return res.status(401).json({
                        message: 'Unauthorized Access'
                    });
                }
                req.decoded = decoded;
                console.log(decoded);
                next();
            });
    } else {
        return res.status(403).json({
            message: 'Forbidden Access'
        });
    }
});

module.exports = router;*/