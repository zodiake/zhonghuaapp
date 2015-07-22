/*jslint node: true */
'use strict';
var pool = require('../utils/pool');

var service = {
    findAll: function () {
        var sql = 'select * from scroll_image';
        return pool.query(sql, []);
    }
};

module.exports = service;
