/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();

var csv = require('csv');
var pool = require('../utils/pool');

router.get('/orders', function (req, res) {
    var stringfier = csv.stringify({
        columns: ['age', 'name'],
        header: true
    });

    var transformer = csv.transform(function (data) {
        return {
            age: data.name,
            name: data.password
        };
    });

    res.attachment('test.csv');
    pool.stream('select name ,password from usr where id=1').pipe(transformer).pipe(stringfier).pipe(res);
});

module.exports = router;
