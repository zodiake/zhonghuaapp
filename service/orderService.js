var pool = require('../utils/pool');
var _ = require('lodash');

var service = {
    findByUsrAndState: function(userId, state, page) {
        var sqlWithState = 'select * from orders where user_id=? and state=? order by created_time limit ?,?';
        var sql = 'select * from orders where user_id=? order by created_time limit ?,?';

        if (state == 'all') {
            return pool.query(sql, [userId, page.page, page.size]);
        } else {
            return pool.query(sqlWithState, [userId, state, page.page, page.size]);
        }
    }
};

module.exports = service;
