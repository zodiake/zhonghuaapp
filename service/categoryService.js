/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var q = require('q');

var service = {
    cache: {},
    findByParent: function (parentId) {
        var defer = q.defer();
        var sql;
        var self = this;
        if (parentId === null) {
            sql = 'select * from cargoo_name where parent_id is null and activate=1';
            if (this.cache.first) {
                defer.resolve(this.cache.first);
                return defer.promise;
            } else {
                return pool.query(sql, []).then(function (data) {
                    self.cache.first = data;
                    return data;
                });
            }
        } else {
            sql = 'select * from cargoo_name where parent_id=? and activate=1';
            if (this.cache[parentId]) {
                defer.resolve(this.cache[parentId]);
                return defer.promise;
            } else {
                return pool.query(sql, [parentId]).then(function (data) {
                    self.cache[parentId] = data;
                    return data;
                });
            }

        }
    },
    findAll: function () {
        var sql = 'select * from cargoo_name where activate=1';
        var defer = q.defer();
        var self = this;
        if (this.cache.all) {
            defer.resolve(this.cache.all);
            return defer.promise;
        } else {
            return pool.query(sql, []).then(function (data) {
                self.cache.all = data;
                return data;
            });
        }
    }
    findByName: function (name) {
        var sql = 'select * from cargoo_name where name=? and activate=1';
        var defer = q.defer();
        var self = this;
        if (this.cache[name]) {
            defer.resolve(this.cache[name]);
            return defer.promise;
        } else {
            return pool.query(sql, [name]).then(function (data) {
                self.cache[name] = data;
                return data;
            });
        }
    }
};

module.exports = service;
