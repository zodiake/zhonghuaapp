var pool = require('../utils/pool');
var _ = require('lodash');
var q = require('q');
var request = require('request');
var config = require('../config');


var service = {
    convertArrayToString: function(data) {
        var array = _.chain(data).filter(function(d) {
            return d.state = '运送中';
        }).map(function(d) {
            return d.id;
        });
        return 'id=[' + array.join(',') + ']';
    },
    findByUsrAndState: function(userId, state, page) {
        var sqlWithState = 'select * from orders where user_id=? and state=? order by created_time limit ?,?';
        var sql = 'select * from orders where user_id=? order by created_time limit ?,?';

        if (state == 'all') {
            return pool.query(sql, [userId, page.page, page.size]);
        } else {
            return pool.query(sqlWithState, [userId, state, page.page, page.size]);
        }
    },
    findByUsrIdAndId: function(userId, orderId) {
        var sql = 'select * from orders where user_id=? and id=?';
        return pool.query(sql, [userId, orderId]);
    },
    save: function(order) {
        var sql = 'insert into orders(user_id,total,created_time,state) values(?,?,?,?)';
        return pool.query(sql, [order.userId, order.total, order.createdTime, order.state]);
    },
    merge: function(webData, data) {
        return _.map(data, function(d) {
            _.each(webData, function(wd) {
                if (d.id == wd.id) {
                    d.sub = wd.state;
                    d.vehicle = wd.vehicle;
                    return;
                }
            })
            return d;
        });
    }
};

module.exports = service;
