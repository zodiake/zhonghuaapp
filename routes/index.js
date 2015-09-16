/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var versionService = require('../service/versionService');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/login.html', function (req, res) {
    res.render('login');
});

router.get('/version/consignee', function (req, res, next) {
    versionService
        .findConsigneeVersion()
        .then(function (data) {
            res.json({
                status: 'success',
                data: data[0]
            });
        })
        .catch(function (err) {
            next(err);
        })
        .fail(function (err) {
            next(err);
        });
});

router.get('/version/consignor', function (req, res, next) {
    versionService
        .findConsignorVersion()
        .then(function (data) {
            res.json({
                status: 'success',
                data: data[0]
            });
        })
        .catch(function (err) {
            next(err);
        })
        .fail(function (err) {
            next(err);
        });
});

module.exports = router;
