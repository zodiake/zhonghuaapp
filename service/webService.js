/*jslint node: true */
'use strict';
var q = require('q');
var request = require('request');
var factoryType = require('../factoryType');

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
            if (response && response.statusCode == 200) {
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
    merge: function (data, type, orderId) {
        var defer = q.defer();
        request({
            url: factoryType[type] + orderId,
            timeout: 5000
        }, function (err, response, body) {
            if (err) {
                defer.reject(err);
            }
            if (response.statusCode == 200) {
                var result = JSON.parse(body)[0];
                if (result.status) {
                    data.states.unshift({
                        stateName: '排队中',
                        waiting: result.Waiting,
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
