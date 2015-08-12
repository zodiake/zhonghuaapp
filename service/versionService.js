/*jslint node: true */
'use strict';
var pool = require('../utils/pool');

var service = {
    findOne: function () {
        var sql = 'select * from app_version';
        return pool.query(sql, []);
    }
}

module.exports = service;
