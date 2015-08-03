/*jslint node: true */
'use strict';
var q = require('q');
var request = require('request');
var factoryType = require('../factoryType');
var factorySingleType = require('../factorySingleType');

var service = {
    queryFromWeb: function (type, query) {
        var defer = q.defer();
        request({
            url: factoryType[type] + query,
            timeout: 5000
        }, function (err, response, body) {
            if (err) {
                defer.reject(err);
            }
            if (response.statusCode == 200) {
                defer.resolve(JSON.parse(body));
            } else {
                defer.reject({
                    status: 'fail',
                    message: 'web service fail'
                });
            }
        });
        return defer.promise;
    },
    merge: function (data, type, query) {
        var defer = q.defer();
        request({
            url: factorySingleType[type] + '?' + query,
            timeout: 5000
        }, function (err, response, body) {
            if (err) {
                defer.reject(err);
            }
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                if (result.status) {
                    data.states.unshift({
                        stateName: '排队中',
                        waiting: result.waiting,
                        createTime: new Date()
                    });
                }
                defer.resolve(data);
            } else {
                defer.reject({
                    status: 'fail',
                    message: 'web service fail'
                });
            }
        });
        return defer.promise;
    }
};

module.exports = service;
