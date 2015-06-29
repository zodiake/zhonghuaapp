var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var userService = require('../service/userService');
var config = require('../config');
var user_type = require('../userAuthority');
var userDetailService = require('../service/userDetailService');
var genderType = require('../gender');

var user_mobile = {};

/* GET users listing. */
router.get('/', function(req, res) {
    userService
        .findOne(1)
        .then(function(data) {
            res.json(data);
        });
});

var verify = e_jwt({
    secret: config.key
});

//获取验证码
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

//注册
router.post('/signup', function(req, res, next) {
    var name = req.body.name,
        password = req.body.password,
        captcha = req.body.captcha,
        type = user_type[req.body.type];

    if (!user_mobile[name] || captcha != user_mobile[name]) {
        res.json({
            status: 'fail',
            message: 'captcha not match'
        });
        return next();
    }
    if (type === undefined) {
        res.json({
            status: 'fail',
            message: 'type can not be null'
        });
        return next();
    }

    userService.save({
        name: name,
        password: password,
        authority: type
    }).then(function(result) {
        return userDetailService
            .save({
                id: result
            })
            .then(function(data) {
                delete user_mobile[name]
                var token = jwt.sign({
                    id: result,
                    name: name,
                    authority: type
                }, config.key);
                res.json({
                    status: 'success',
                    data: token
                });
            })
    }).catch(function(err) {
        return next(err);
    });
});

//登入
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

//修改密码
router.post('/changePwd',
    verify,
    function(req, res, next) {
        var oldPwd = req.body.oldPwd,
            newPwd = req.body.newPwd,
            usrId = req.user.id;
        //todo encrypt password

        userService
            .findOne(usrId)
            .then(function(data) {
                if (data.password == oldPwd) {
                    return userService.updatePwd({
                        id: usrId,
                        password: newPwd
                    });
                } else {
                    throw new Error('oldPassword not correct');
                }
            })
            .then(function() {
                res.json({
                    status: 'success'
                });
            })
            .catch(function(err) {
                return next(err);
            });
    });

router.get('/detail',
    verify,
    function(req, res, next) {
        var id = req.user.id;
        userDetailService
            .findOne(id)
            .then(function(data) {
                res.json({
                    status: 'success',
                    data: data[0]
                });
            })
            .catch(function(err) {
                return next(err);
            });
    });

router.post('/detail',
    verify,
    function(req, res, next) {
        var usr = req.user,
            name = req.body.name,
            gender = genderType[req.body.gender],
            identfied_number = req.body.identify,
            company_name = req.body.companyName;
        userDetailService
            .update({
                id: usr.id,
                name: name,
                gender: gender,
                identfied_number: identfied_number,
                company_name: company_name
            })
            .then(function(data) {
                res.json({
                    status: 'success'
                });
            }).catch(function(err) {
                return next(err);
            })

    });

module.exports = router;
