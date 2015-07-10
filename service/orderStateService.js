/*jslint node: true */
'use strict';
var pool = require('../utils/pool');

var service = {
    save: function(state) {
        console.log('state', state);
        var sql = 'insert into order_state set ?';
        return pool.query(sql, state);
    }
};

module.exports = service;
