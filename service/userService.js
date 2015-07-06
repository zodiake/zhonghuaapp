/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var squel = require('squel');

var service = {
    findOne: function(id) {
        return pool.query('select * from usr where id=?', [id]);
    },
    findByName: function(name) {
        return pool.query('select * from usr where name=?', [name]);
    },
    findAll: function(page) {
        return pool.query('select * from usr limit ?,?', [page.page, page.size]);
    },
    $$search: function(option, pageable, count) {
        var sql, page = pageable.page,
            size = pageable.size;
        if (count)
            sql = squel.select().field('count(*)', 'countNum').from('usr');
        else {
            sql = squel.select().from('usr');
            sql.offset(page * size).limit(size);
        }
        sql.join('usr_detail', null, 'usr.id=usr_detail.id');
        pool.buildSql(sql, option);
        return pool.query(sql.toString(), []);
    },
    findByOption: function(option, page) {
        console.log(page.page, page.size);
        return this.$$search(option, page, false);
    },
    countByOption: function(option, page) {
        return this.$$search(option, page, true);
    },
    countByMobile: function(mobile) {
        return pool.query('select count(*) as usrCount from usr where name=?', [mobile]);
    },
    save: function(usr) {
        usr.activate = 1;
        var sql = 'insert into usr set ?';
        return pool.insert(sql, usr);
    },
    updatePwd: function(usr) {
        var sql = 'update usr set ?';
        return pool.update(sql, usr);
    }
};

module.exports = service;
