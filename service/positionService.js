var pool = require('../utils/pool');
var config = require('../config');

var service = {
    insert: function(data) {
        console.log(data);
        var sql = 'insert into order_gis set ?';
        return pool.query(sql, data);
    },
    findAll: function(orderId, cb) {
        var sql = 'select * from order_gis where order_id=? order by created_time';
        return pool.query(sql, [orderId]);
    }
}

module.exports = service;
