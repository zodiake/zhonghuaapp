/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var _ = require('lodash');
var userAuthority = require('../userAuthority');
var squel = require('squel');
var q = require('q');

var service = {
    findOne: function(id) {
        var sql = 'select * from orders where id=?';
        return pool.query(sql, [id]);
    },
    findOneAndState: function(usr, id) {
        var sql;
        if (usr.authority == userAuthority.consignee)
            sql = 'select * from orders left join order_state on order_state.order_id=orders.id where orders.id=? and orders.consignee=? order by created_time';
        if (usr.authority == userAuthority.consignor)
            sql = 'select * from orders left join order_state on order_state.order_id=orders.id where orders.id=? and orders.consignor=? order by created_time';
        return pool.query(sql, [id, usr.id]);
    },
    convertArrayToString: function(data) {
        var array = data.map(function(d) {
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
    countByUsrIdAndId: function(user, orderId) {
        var consigneeSql = 'select count(*) as countnum from orders where id=? and consignee=?';
        var consignorSql = 'select count(*) as countnum from orders where id=? and consignor=?';
        if (user.authority == userAuthority.consignee) {
            return pool.query(consigneeSql, [orderId, user.id]);
        } else if (user.authority == userAuthority.consignor) {
            return pool.query(consignorSql, [orderId, user.id]);
        } else {
            var defer = q.defer();
            defer.reject();
            return defer.promise;
        }

    },
    findByOrderId: function(orderId) {
        var sql = 'select * from orders join usr on orders.consignee=usr.id where order_id=?';
        return pool.query(sql, [orderId]);
    },
    $$buildOptionSql: function(page, option, count) {
        var limit = page.size;
        var offset = (page.page - 1) * limit;
        var sql;
        if (count)
            sql = squel.select().field('count(*)', 'countNum').from('orders');
        else
            sql = squel.select().from('orders');
        if (option.begin_time && option.begin_time.value) {
            sql.where('created_time >' + option.begin_time.value);
        }
        delete option.begin_time;
        if (option.end_time && option.end_time.value) {
            sql.where('created_time <' + option.end_time.value);
        }
        delete option.end_time;
        sql.join('usr', null, 'usr.id=orders.consignor');
        sql = pool.buildSql(sql, option);
        sql.offset(offset).limit(limit);
        return sql;
    },
    findByOption: function(page, option) {
        return pool.query(this.$$buildOptionSql(page, option, false).toString(), []);
    },
    countByOption: function(page, option) {
        return pool.query(this.$$buildOptionSql(page, option, true).toString(), []);
    },
    save: function(order) {
        var sql = 'insert into orders set ?';
        return pool.insert(sql, order);
    },
    updateState: function(order) {
        var sql = 'update orders set current_state=? where id=?';
        return pool.query(sql, [order.state, order.id]);
    },
    update: function(order, id) {
        var sql = 'update orders set ? where id=?';
        return pool.query(sql, [order, id]);
    },
    merge: function(webData, data) {
        return _.map(data, function(d) {
            _.each(webData, function(wd) {
                if (d.id == wd.id) {
                    d.sub = wd.state;
                    d.vehicle = wd.vehicle;
                    return;
                }
            });
            return d;
        });
    }
};

module.exports = service;
