var pool = require('../utils/pool');
var _ = require('lodash');
var q = require('q');
var request = require('request');
var config = require('../config');
var userAuthority = require('../userAuthority');


var service = {
    convertArrayToString: function(data) {
        var array = _.chain(data).filter(function(d) {
            return d.state = '运送中';
        }).map(function(d) {
            return d.id;
        });
        return 'id=[' + array.join(',') + ']';
    },
    /*find all orders by consingor or consignee */
    findByConsignorAndState: function(userId, state, page) {
        var sqlAll = 'select * from orders where consignor=? order by created_time limit ?,?';
        var sqlWithState = 'select * from orders where consignor=? and state=? order by created_time limit ?,?';

        if (state == 'all')
            return pool.query(sqlAll, [userId, page.page, page.size]);
        else
            return pool.query(sqlWithState, [userId, state, page.page, page.size]);
    },
    findByConsigneeAndState: function(userId, state, page) {
        var sqlAll = 'select * from orders where consignee=? order by created_time limit ?,?';
        var sqlWithState = 'select * from orders where consignee=? and state=? order by created_time limit ?,?';

        if (state == 'all')
            return pool.query(sqlAll, [userId, page.page, page.size]);
        else
            return pool.query(sqlWithState, [userId, state, page.page, page.size]);
    },
    findByUsrAndState: function(user, state, page) {
        if (user.authority == userAuthority.consignee)
            return this.findByConsigneeAndState(user.id, state, page);
        else
            return this.findByConsignorAndState(user.id, state, page);
    },
    /*findOne by consignee or consignor */
    findByConsigneeAndId: function(userId, id) {
        var sql = 'select * from orders where consignee=? and id=?';
        return pool.query(sql, [userId, id]);
    },
    findByConsignorAndId: function(userId, id) {
        var sql = 'select * from orders where consignor=? and id=?';
        return pool.query(sql, [userId, id]);
    },
    findByUsrIdAndId: function(user, orderId) {
        if (user.authority == userAuthority.consignee)
            return this.findByConsignorAndId(user.id, orderId);
        else
            return this.findByConsignorAndId(user.id, orderId);
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
