/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var _ = require('lodash');
var userAuthority = require('../userAuthority');
var orderState = require('../orderState');
var squel = require('squel');
var q = require('q');

var service = {
    findOne: function (id) {
        var sql = 'select * from orders where id=?';
        return pool.query(sql, [id]);
    },
    findByOrderNumber: function (id) {
        var sql = 'select * from orders where order_number=?';
        return pool.query(sql, [id]);
    },
    findOneAndState: function (usr, id) {
        var sql;
        if (usr.authority === userAuthority.consignee) {
            sql = 'select * from orders left join order_state on order_state.order_id=orders.id left join reviews on reviews.order_id=orders.id where orders.id=? and orders.consignee=? order by order_state.created_time desc';
        }
        if (usr.authority === userAuthority.consignor) {
            sql = 'select * from orders left join order_state on order_state.order_id=orders.id left join reviews on reviews.order_id=orders.id where orders.id=? and orders.consignor=? order by order_state.created_time desc';
        }
        return pool.query(sql, [id, usr.name]);
    },
    convertArrayToString: function (data) {
        var array = data.map(function (d) {
            return d.id;
        });
        return array.join(',');
    },
    findByUsrAndState: function (user, state, page) {
        var sql = squel.select().from('orders'),
            stateFilter = squel.expr(),
            userFilter = squel.expr();
        if (state.length > 0) {
            state.forEach(function (d) {
                stateFilter.or("current_state='" + d + "'");
            });
        }
        if (user.authority === userAuthority.consignor) {
            userFilter.and("consignor='" + user.name + "'");
        } else if (user.authority === userAuthority.consignee) {
            userFilter.and("consignee='" + user.name + "'");
            userFilter.and("current_state!='" + orderState.dispatch + "'");
        }
        userFilter.and("current_state!='" + orderState.closed + "'");

        sql.where(stateFilter);
        sql.where(userFilter);
        sql.limit(page.size).offset(page.page * page.size);
        return pool.query(sql.toString(), []);
    },
    /*findOne by consignee or consignor */
    findByConsigneeAndId: function (userId, id) {
        var sql = 'select * from orders where consignee=? and id=?';
        return pool.query(sql, [userId, id]);
    },
    findByConsignorAndId: function (userId, id) {
        var sql = 'select * from orders where consignor=? and id=?';
        return pool.query(sql, [userId, id]);
    },
    findByUsrIdAndId: function (user, orderId) {
        if (user.authority === userAuthority.consignee) {
            return this.findByConsignorAndId(user.id, orderId);
        }
        return this.findByConsignorAndId(user.id, orderId);
    },
    countByUsrIdAndId: function (user, orderId) {
        var consigneeSql = 'select count(*) as countnum from orders where id=? and consignee=?',
            consignorSql = 'select count(*) as countnum from orders where id=? and consignor=?';
        if (user.authority === userAuthority.consignee) {
            return pool.query(consigneeSql, [orderId, user.name]);
        } else if (user.authority === userAuthority.consignor) {
            return pool.query(consignorSql, [orderId, user.name]);
        } else {
            var defer = q.defer();
            defer.reject();
            return defer.promise;
        }

    },
    findByOrderId: function (orderId) {
        var sql = 'select * from orders join usr on orders.consignee=usr.id where order_id=?';
        return pool.query(sql, [orderId]);
    },
    $$buildOptionSql: function (page, option, count) {
        var limit = page.size;
        var offset = (page.page - 1) * limit;
        var sql;
        if (count) {
            sql = squel.select().field('count(*)', 'countNum').from('orders').join('cargoo_name', '', 'cargoo_name.id=orders.cargoo_name');
        } else {
            sql = squel.select()
                .field('orders.id', 'id')
                .field('orders.consignee', 'consignee')
                .field('orders.consignor', 'consignor')
                .field('orders.order_number', 'order_number')
                .field('orders.consignee_name', 'consignee_name')
                .field('orders.company_name', 'company_name')
                .field('cargoo_name.name', 'cargoo_name')
                .field('orders.quantity', 'quantity')
                .field('orders.created_time', 'created_time')
                .field('orders.current_state', 'current_state')
                .from('orders')
                .join('cargoo_name', '', 'cargoo_name.id=orders.cargoo_name');
        }
        if (option.begin_time && option.begin_time.value) {
            sql.where('created_time >' + option.begin_time.value);
        }
        delete option.begin_time;
        if (option.end_time && option.end_time.value) {
            sql.where('created_time <' + option.end_time.value);
        }
        delete option.end_time;
        sql = pool.buildSql(sql, option);
        if (!count) {
            sql.offset(offset).limit(limit);
        }
        return sql;
    },
    findByOption: function (page, option) {
        return pool.query(this.$$buildOptionSql(page, option, false).toString(), []);
    },
    countByOption: function (page, option) {
        return pool.query(this.$$buildOptionSql(page, option, true).toString(), []);
    },
    innerJoinUser: function (id) {
        var sql = 'SELECT orders.id, orders.order_number, orders.license, orders.consignee_name AS consigneeName, orders.consignee, orders.consignor, orders.company_name, orders.category, orders.cargoo_name, orders.origin, orders.destination, orders.etd, orders.quantity, orders.created_time FROM orders WHERE orders.id = ?';
        return pool.query(sql, [id]);
    },
    countByStateAndConsignee: function (order) {
        var sql = 'select count(*) as countNum from orders where current_state=? and consignee=?';
        return pool.query(sql, [order.state, order.consignee]);
    },
    save: function (order) {
        var sql = 'insert into orders set ?';
        return pool.insert(sql, order);
    },
    countAll: function () {
        var sql = 'select count(*) as countNum from orders';
        return pool.query(sql, []);
    },
    countByAppOrOut: function (appOrOut) {
        var sql = 'select count(*) as countNum from orders where app_or_out=?';
        return pool.query(sql, appOrOut);
    },
    countByState: function (state) {
        var sql = 'select count(*) as countNum from orders where current_state=?';
        return pool.query(sql, [state]);
    },
    aggregate: function () {
        var sqlCountAll = 'select count(*) as countNum from orders';
        var sqlApp = 'select count(*) as countNum from orders where app_or_out=1';
        var sqlOut = 'select count(*) as countNum from orders where app_or_out=0';
        var sqlDispatch = "select count(*) as countNum from orders where current_state='" + orderState.dispatch + "'";
        var sqlConfirm = "select count(*) as countNum from orders where current_state='" + orderState.confirm + "'";
        var sqlTransport = "select count(*) as countNum from orders where current_state='" + orderState.transport + "'";
        var sqlArrive = "select count(*) as countNum from orders where current_state='" + orderState.arrive + "'";
        var sqlAppraise = "select count(*) as countNum from orders where current_state='" + orderState.appraise + "'";
        var sqlRefuse = "select count(*) as countNum from orders where current_state='" + orderState.refuse + "'";
        var array = [sqlCountAll, sqlApp, sqlOut, sqlDispatch, sqlConfirm, sqlTransport, sqlArrive, sqlAppraise, sqlRefuse];
        return pool.query(array.join(";"), []);
    },
    updateStateByIdAndUser: function (order, user) {
        var sql;
        if (user.authority === userAuthority.consignor) {
            sql = 'update orders set current_state=? where id=? and consignor=?';
        } else if (user.authority === userAuthority.consignee) {
            sql = 'update orders set current_state=? where id=? and consignee=?';
        }
        return pool.query(sql, [order.state, order.id, user.name]);
    },
    update: function (order, id, user) {
        var sql = 'update orders set ? where id=? and consignor=?';
        return pool.query(sql, [order, id, user.name]);
    },
    updateByOrderNumber: function (orderNumber, order) {
        var sql = 'update orders set ? where order_number=?';
        return pool.query(sql, [order, orderNumber]);
    },
    updateWeightByOrderNumber: function (weight, orderNumber) {
        var sql = 'update orders set actual_weight=? where order_number=?';
        return pool.query(sql, [weight, orderNumber]);
    },
    close: function (orderId) {
        var sql = "update orders set current_state='已关闭' where order_number=?";
        return pool.query(sql, [orderId]);
    },
    merge: function (webData, data) {
        return _.map(data, function (d) {
            _.each(webData, function (wd) {
                if (wd.Status === true && d.order_number === wd.BillCode) {
                    d.waiting = wd.Waiting;
                    d.actual_weight = wd.actual_weight;
                    return;
                }
            });
            return d;
        });
    }
};

module.exports = service;
