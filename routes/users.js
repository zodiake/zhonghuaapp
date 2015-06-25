var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var userService = require('../service/userService');
var config = require('../config');

var user_mobile = {};

var user_type = {
    consignee: 'ROLE_CONSIGNEE',
    consignor: 'ROLE_CONSIGNOR'
};

/* GET users listing. */
router.get('/', function(req, res) {
    userService
        .findOne(1)
        .then(function(data) {
            res.json(data);
        });
});

router.get('/captcha', function(req, res) {
    var mobile = req.query.mobile;
    userService
        .countByMobile(mobile)
        .then(function(data) {
            if (data[0].usrCount === 0) {
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
        captcha = req.body.captcha,
        type = user_type[req.body.type];

    if (!user_mobile[name] || captcha != user_mobile[name]) {
        res.json({
            status: 'fail',
            message: 'captcha not match'
        });
    }
    if (type === undefined) {
        res.json({
            status: 'fail',
            message: 'type can not be null'
        });
    }

    userService.save({
        name: name,
        password: password,
        authority: type
    }).then(function(result) {
        delete user_mobile[name]
        var token = jwt.sign({
            id: result.insertId,
            name: name,
            authority: type
        }, config.key);
        res.json({
            status: 'success',
            data: token
        });
    }).error(function(err) {
        res.json({
            status: 'fail'
        });
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
                var token = jwt.sign({
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
