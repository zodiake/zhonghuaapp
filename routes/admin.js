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

module.exports = router;
