/**
 * Created by yagamai on 15-7-14.
 */
'use strict';
var pool = require('../utils/pool');

var service = {
    save: function (consigneeId, user) {
        var common = {
            consignee_id: consigneeId,
            consignor_id: user.id
        };
        return pool.query('insert into common_consignee set ?', common);
    },
    findByConsignor: function (user) {
        var sql = 'select * from common_consignee left join usr_detail on common_consignee.consignee_id=usr_detail.id where common_consignee.consignor_id=?';
        return pool.query(sql, [user.id]);
    }
};

module.exports = service;
