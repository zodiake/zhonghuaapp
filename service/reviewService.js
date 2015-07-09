/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var connection = pool.pool;
var orderService = require('./orderService');
var userDetailService = require('./userDetailService');
var q = require('q');

var service = {
    findOne: function() {

    },
    findAll: function() {

    },
    findByOrder: function(id) {
        var sql = 'select * from reviews where order_id=?';
        return pool.query(sql, [id]);
    },
    countByOrder: function(id) {
        var sql = 'select count(*) as countNum from reviews where order_id=?';
        return pool.query(sql, [id]);
    },
    save: function(review) {
        var sql = 'insert into reviews set ?';
        //if user give good praise
        var defer = q.defer();
        if (review.level == 1) {
            pool.getConnection()
                .then(function(connection) {
                    connection.beginTransaction(function(err) {
                        if (err) {
                            console.log(err);
                            defer.reject(err);
                        }
                        console.log('transaction begin');
                        //insert into reviews
                        connection.query(sql, review, function(err, result) {
                            console.log('insert reviews begin');
                            if (err) {
                                connection.rollback(function() {
                                    console.log(err);
                                    defer.reject('insert err');
                                });
                            }
                            var findById = 'select consignee from orders where id=?';
                            //if success select which consignee
                            connection.query(findById, [review.order_id], function(err, result) {
                                console.log('find by consignee');
                                if (err) {
                                    console.log(err);
                                    connection.rollback(function() {
                                        defer.reject('find err');
                                    });
                                }
                                var consigneeId = result[0].consignee;
                                var praise = 'update usr_detail set praise=praise+1 where id=?';
                                //if success update usr_detail praise=praise+1
                                connection.query(praise, [consigneeId], function(err, result) {
                                    if (err) {
                                        console.log(err);
                                        connection.rollback(function() {
                                            defer.reject('praise err');
                                        });
                                    }
                                    var state = {
                                        order_id: review.order_id,
                                        state_name: '已评价',
                                        created_time: new Date()
                                    };
                                    connection.commit(function() {
                                        defer.resolve();
                                    });
                                });
                            });
                        });
                    });
                });
            return defer.promise;
        } else {
            pool
                .getConnection()
                .then(function(connection) {
                    connection.beginTransaction(function(err) {

                    });
                })
        }
    }
};

module.exports = service;
