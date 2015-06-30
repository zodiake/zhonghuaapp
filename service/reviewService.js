var pool = require('../utils/pool');
var q = require('q');
var config = require('../config');
var orderService = require('./orderService');
var userDetailService = require('./userDetailService');

var service = {
    findOne: function(id) {

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
        if (review.level == 1) {
            return orderService.findOne(review.order_id)
                .then(function(order) {
                    return userDetailService.praise(order[0].consignee);
                })
                .then(function() {
                    return pool.insert(sql, review);
                });
        }
        return pool.insert(sql, review);
    }
};

module.exports = service;
