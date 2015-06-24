var pool = require('../utils/pool');
var _ = require('lodash');
var q = require('q');
var request = require('request');
var config = require('../config');

var service = {
    queryFromWeb: function(query) {
        var defer = q.defer();
        request(config.webService + '?' + query, function(err, response, body) {
            if (err) {
                defer.reject(err)
            }
            if (response.statusCode == 200) {
                defer.resolve(JSON.parse(body));
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
