var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var userService = require('../service/userService');
var config = require('../config');

var user_mobile = {};

/* GET users listing. */
router.get('/', function(req, res, next) {
    userService
        .findOne(1)
        .then(function(data) {
            res.json(data);
        });
});

router.get('/captcha', function(req, res, next) {
    var mobile = req.query.mobile;
    userService
        .countByMobile(mobile)
        .then(function(data) {
            if (data[0].usrCount == 0) {
                //todo send short message
                user_mobile[mobile] = "1111";
                res.json({
                    status: 'success',
                });
            } else {
                res.json({
                    status: 'fail',
                    message: 'user exist'
                });
            }
        });
});

router.post('/signup', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        mobile = req.body.mobile,
        captcha = req.body.captcha;
    if (captcha != user_mobile[mobile]) {
        res.json({
            status: 'fail',
            message: 'captcha not match'
        });
    }
    userService.save({
        name: name,
        password: password,
        mobile: mobile
    }).then(function() {
        delete user_mobile[mobile]
        res.json(signedPassword);
    });
});

router.post('/login', function(req, res) {
    var name = req.body.name,
        password = req.body.password;
    userService
        .findByName(name)
        .then(function(data) {
            if (data.length == 0) {
                res.json({
                    status: 'fail',
                    message: 'user not exist'
                });
            } else if (data[0].password != password) {
                //to do password encode
                res.json({
                    status: 'fail',
                    message: 'password error'
                })
            } else {
                var usr = data[0];
                token = jwt.sign({
                    id: usr.id,
                    name: usr.name,
                    authority: usr.authority
                }, config.key);
                res.json({
                    status: 'success',
                    token: token
                })
            }
        });
});


module.exports = router;
