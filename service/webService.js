var pool = require('../utils/pool');
var _ = require('lodash');
var q = require('q');
var request = require('request');
var factoryType = require('../factoryType');

var service = {
    queryFromWeb: function(type, query) {
        var defer = q.defer();
        request({
            url: factoryType[type] + '?' + query,
            timeout: 5000
        }, function(err, response, body) {
            console.log(factoryType[type] + '?' + query);
            if (err) {
                defer.reject(err)
            }
            if (response.statusCode == 200) {
                defer.resolve(JSON.parse(body));
                console.log('resolved');
            } else {
                defer.reject({
                    status: 'fail',
                    message: 'web service fail'
                })
            }
        });
        return defer.promise;
    }
}

module.exports = service;
