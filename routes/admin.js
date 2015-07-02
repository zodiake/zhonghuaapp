/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var e_jwt = require('express-jwt');
var userAuthority = require('../userAuthority');
var config = require('../config');
var csv = require('csv');
var fs = require('fs');
var join = require('path').join;

var orderService = require('../service/orderService');
var userService = require('../service/userService');

router.use(e_jwt({
    secret: config.key
}));

router.use(function(req, res, next) {
    if (req.user.authority != userAuthority.admin) {
        var err = new Error();
        err.name = 'UnauthorizedError';
        return next(err);
    }
    next();
});

router.post('/csv/upload', function(req, res) {
    var path = join(__dirname, '..', req.files.file.path);
    fs.createWriteStream(path);
    res.json('ok');
});

module.exports = router;
