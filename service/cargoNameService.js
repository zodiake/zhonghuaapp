/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var q = require('q');

var service = {
    cache: {},
    findByCategory: function(categoryId) {
        var sql = 'select * from cargoo_name where category_id =?';
        var defer = q.defer();
        if (this.cache[categoryId]) {
            defer.resolve(this.cache[categoryId]);
            return defer.promise;
        } else {
            return pool.query(sql, [categoryId], this.cache, categoryId);
        }
    }
};

module.exports = service;
