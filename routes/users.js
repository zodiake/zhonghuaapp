/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var userService = require('../service/userService');
var config = require('../config');
var user_type = require('../userAuthority');
var userDetailService = require('../service/userDetailService');
var genderType = require('../gender');
var crypto = require('crypto');

var user_mobile = {};

var cryptoPwd = function (password) {
    return crypto.createHash('md5').update(password).digest('hex');
};

/* GET users listing. */
router.get('/', function (req, res, next) {
    var mobile = req.query.mobile;
    userService
        .findByName(mobile)
        .then(function (data) {
            res.json({
                status: 'success',
                data: data[0]
            });
        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
});

var verify = e_jwt({
    secret: config.key
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//获取验证码
router.get('/captcha', function (req, res) {
    var mobile = req.query.mobile;
    userService
        .countByMobile(mobile)
        .then(function (data) {
            if (data[0].usrCount === 0) {
                //todo send short message
                user_mobile[mobile] = 1111; //getRandomInt(1000, 9999);
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
router.post('/signup', function (req, res, next) {
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
        password: cryptoPwd(password),
        authority: type
    }).then(function (result) {
        return userDetailService
            .save({
                id: result,
                created_Time: new Date()
            })
            .then(function (data) {
                delete user_mobile[name];
                var token = jwt.sign({
                    id: result,
                    name: name,
                    authority: type
                }, config.key);
                res.json({
                    status: 'success',
                    data: token
                });
            });
    }).catch(function (err) {
        return next(err);
    });
});

router.post('/admin/login', function (req, res, next) {
    var name = req.body.name,
        password = req.body.password;
    userService
        .findByName(name)
        .then(function (data) {
            if (data.length === 0) {
                var err = new Error('用户不存在');
                return next(err);
            } else if (data[0].password != cryptoPwd(password)) {
                var err = new Error('密码错误');
                return next(err);
            }
            var usr = data[0];
            var token = jwt.sign({
                id: usr.id,
                name: usr.name,
                authority: usr.authority
            }, config.key);
            res.json({
                status: 'success',
                token: token,
                authority: usr.authority
            });
        });
});

//登入
router.post('/login', function (req, res, next) {
    var name = req.body.name,
        password = req.body.password;
    userService
        .findByName(name)
        .then(function (data) {
            if (data.length === 0) {
                res.json({
                    status: 'fail',
                    message: '用户不存在'
                });
                return;
            } else if (data[0].password != cryptoPwd(password)) {
                //to do password encode
                res.json({
                    status: 'fail',
                    message: '密码错误'
                });
                return;
            } else if (data[0].activate === 0) {
                res.json({
                    status: 'fail',
                    message: '用户被冻结'
                });
                return;
            }
            return userDetailService
                .findOne(data[0].id)
                .then(function (detail) {
                    var usr = data[0];
                    var token = jwt.sign({
                        id: usr.id,
                        name: usr.name,
                        authority: usr.authority
                    }, config.key);
                    res.json({
                        status: 'success',
                        token: token,
                        data: detail[0]
                    });
                });
        })
        .catch(function (err) {
            return next(err);
        });
});

//修改密码
router.post('/changePwd',
    verify,
    function (req, res, next) {
        var oldPwd = req.body.oldPwd,
            newPwd = req.body.newPwd,
            usrId = req.user.id;

        userService
            .findOne(usrId)
            .then(function (data) {
                if (data[0] && data[0].password == cryptoPwd(oldPwd)) {
                    return userService.updatePwd({
                        id: usrId,
                        password: cryptoPwd(newPwd)
                    });
                } else {
                    return 'fail';
                }
            })
            .then(function (data) {
                if (data == 'fail')
                    res.json({
                        status: 'fail',
                        message: 'oldPwd not match'
                    });
                else
                    res.json({
                        status: 'success'
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    });

router.get('/detail',
    verify,
    function (req, res, next) {
        var id = req.user.id;
        userDetailService
            .findOne(id)
            .then(function (data) {
                res.json({
                    status: 'success',
                    data: data[0]
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });

router.post('/detail',
    verify,
    function (req, res, next) {
        var usr = req.user,
            name = req.body.name,
            gender = genderType[req.body.gender],
            identfied_number = req.body.identify,
            company_name1 = req.body.companyName1,
            company_name2 = req.body.companyName2,
            company_name3 = req.body.companyName3;
        userDetailService
            .update({
                id: usr.id,
                detail_name: name,
                gender: gender,
                identified_number: identfied_number,
                company_name1: company_name1,
                company_name2: company_name2,
                company_name3: company_name3
            })
            .then(function (data) {
                res.json({
                    status: 'success'
                });
            }).catch(function (err) {
                return next(err);
            });

    });

module.exports = router;
