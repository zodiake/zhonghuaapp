var pool = require('../utils/pool');
var q = require('q');
var config = require('../config');

var service = {
    findAll: function(pageable) {
        var sql = 'select * from suggestion order by created_time limit ?,?';
        return pool.query(sql, [pageable.page, pageable.size]);
    },
    findByState: function(state, pageable) {
        var sql = 'select * from suggestion where state=? order by created_time limit ?,?';
        if (state == 'all')
            return this.findAll(pageable);
        return pool.query(sql, [state, pageable.page, pageable.size]);
    },
    findOne: function(id) {
        var sql = 'select * from suggestion where id=?';
        return pool.query(sql, [id]);
    },
    save: function(suggestion) {
        var sql = 'insert into suggestion set ?';
        return pool.insert(sql, suggestion);
    },
    updateState: function(id) {
        var sql = 'update suggestion set state=1 where id=?';
        return pool.update(sql, [id]);
    }
};

module.exports = service;
