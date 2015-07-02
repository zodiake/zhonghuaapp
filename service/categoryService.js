/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var q = require('q');

var service = {
    cache: {},
    findByParent: function(parentId) {
        var defer = q.defer();
        var sql;
        var self = this;
        if (parentId === null) {
            sql = 'select * from cargoo_category where parent_id is null';
            if (this.cache.first) {
                defer.resolve(this.cache.first);
                return defer.promise;
            } else {
                return pool.query(sql, []).then(function(data) {
                    self.cache.first = data;
                    return data;
                });
            }
        } else {
            sql = 'select * from cargoo_category where parent_id=?';
            if (this.cache[parentId]) {
                defer.resolve(this.cache[parentId]);
                return defer.promise;
            } else {
                return pool.query(sql, [parentId]).then(function(data) {
                    self.cache[parentId] = data;
                    return data;
                });
            }

        }
    }
};

module.exports = service;
