var mysql = require('mysql');
var q = require('q');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.168.1.137',
    user: 'root',
    password: '1',
    database: 'test'
});

var service = {
    query: function(sql, param) {
        var defer = q.defer();
        pool.query(sql, param, function(err, rows, fields) {
            if (err) {
                defer.reject(err)
            } else {
                defer.resolve(rows)
            }
        });
        return defer.promise;
    },
    insert: function(sql, param) {
        var defer = q.defer();
        pool.query(sql, param, function(err, result) {
            if (err) {
                defer.reject(err)
            } else {
                defer.resolve(result.insertId);
            }
        });
        return defer.promise;
    }
};

module.exports = service;
