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
var pool = require('../utils/pool');
var multer = require('multer');
var q = require('q');

var orderService = require('../service/orderService');
var userService = require('../service/userService');

router.use(e_jwt({
    secret: config.key
}));

var fileMulter = multer({
    dest: './uploads/',
    group: {
        csv: './csv'
    }
});

router.use(function(req, res, next) {
    if (req.user.authority != userAuthority.admin) {
        var err = new Error();
        err.name = 'UnauthorizedError';
        return next(err);
    }
    next();
});

var usrCall = function(role) {
    return function(req, res, next) {
        var pageable = {
            page: req.query.page - 1 || 0,
            size: req.query.size || 15
        };
        var option = {
            name: req.query.mobile,
            activate: req.query.activate,
            authority: role
        };
        q.all([userService.findByOption(option, pageable), userService.countByOption(option, pageable)])
            .then(function(result) {
                res.json({
                    status: 'success',
                    data: {
                        totol: result[1][0].countNum,
                        data: result[0]
                    }
                });
            })
            .catch(function(err) {
                return next(err);
            });
    }
}

router.get('/consignor', usrCall('ROLE_CONSIGNOR'));

router.get('/consignee', usrCall('ROLE_CONSIGNEE'));

router.post('/csv/upload', fileMulter, function(req, res) {
    if (req.files && req.files.file.mimetype == 'text/csv') {
        var path = join(__dirname, '..', req.files.file.path);

        var parser = csv.parse();
        var rowCount = 0;
        var transformer = csv.transform(function(data) {
            var result = {
                age: data[0],
                name: data[1]
            };
            if (rowCount === 0) {
                rowCount++;
                return null;
            } else {
                var sql = 'insert into testcsv set ?';
                rowCount++;
                pool
                    .insert(sql, result)
                    .catch(function(err) {
                        var message = err.toString().replace(/'/g, '');
                        pool.query('insert into batch_err (message) values (?)', [message]);
                    });
                return data;
            }
        });

        fs.createReadStream(path).pipe(parser).pipe(transformer);

        res.json('ok');
    } else {
        res.json({
            data: 'csv file please'
        });
    }
});

router.get('/orders', function(req, res, next) {
    var page = req.query.page || 1,
        size = req.query.size || 15,
        mobile = req.query.mobile,
        beginTime = req.query.beginTime,
        endTime = req.query.endTime,
        orderId = req.query.orderId;
    var option = {
        mobile: mobile,
        begin_time: {
            operator: '>',
            value: beginTime
        },
        end_time: {
            operator: '<',
            value: endTime
        },
        order_id: orderId
    };
    var page = {
        page: page,
        size: size
    }
    q.all([orderService.findByOption(page, option), orderService.countByOption(page, option)])
        .then(function(result) {
            res.json({
                status: 'success',
                data: {
                    totol: result[1][0].countNum,
                    data: result[0]
                }
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

module.exports = router;
