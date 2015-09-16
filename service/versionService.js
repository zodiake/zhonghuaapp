/*jslint node: true */
'use strict';
var pool = require('../utils/pool');

var service = {
    findOne: function () {
        var sql = 'select * from app_version';
        return pool.query(sql, []);
    },
    findConsigneeVersion: function () {
        var sql = 'select * from app_version where id=1';
        return pool.query(sql, []);
    },
    findConsignorVersion: function () {
        var sql = 'select * from app_version where id=2';
        return pool.query(sql, []);
    }
}

module.exports = service;
