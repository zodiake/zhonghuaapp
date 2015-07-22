/*jslint node: true */
'use strict';
var pool = require('../utils/pool');
var squel = require('squel');

var service = {
    findOne: function (id) {
        return pool.query('select * from usr where id=?', [id]);
    },
    findByName: function (name) {
        return pool.query('select * from usr where name=?', [name]);
    },
    findByNameAndActivate: function (name, activate) {
        return pool.query('select * from usr where name=? and activate=?', [name, activate]);
    },
    findByNameAndAuthority: function (name, authority) {
        return pool.query('select * from usr where name=? and authority=?', [name, authority]);
    },
    findAll: function (page) {
        return pool.query('select * from usr limit ?,?', [page.page, page.size]);
    },
    _buildOptionSql: function (option, pageable, ceOrCr, count) {
        var sql, page = pageable.page,
            size = pageable.size;
        if (count) {
            sql = squel.select().field('count(*)', 'countNum').from('usr');
        } else {
            sql = squel.select().from('usr');
            sql.offset(page * size).limit(size);
        }
        sql.left_join('usr_detail', null, 'usr.id=usr_detail.id');
        if (ceOrCr)
            sql.left_join('vehicle', null, 'vehicle.usr_id=usr.id')
        pool.buildSql(sql, option);
        return pool.query(sql.toString(), []);
    },
    findByOption: function (option, page, ceOrCr) {
        return this._buildOptionSql(option, page, ceOrCr, false);
    },
    countByOption: function (option, page, ceOrCr) {
        return this._buildOptionSql(option, page, ceOrCr, true);
    },
    countByMobile: function (mobile) {
        return pool.query('select count(*) as usrCount from usr where name=?', [mobile]);
    },
    countByIdAndAuthority: function (id, authority) {
        return pool.query('select count(*) as countNum from usr where id=? and authority=?', [id, authority]);
    },
    save: function (usr) {
        usr.activate = 1;
        var sql = 'insert into usr set ?';
        return pool.insert(sql, usr);
    },
    updatePwd: function (usr) {
        var sql = 'update usr set password=? where id=?';
        return pool.query(sql, [usr.password, usr.id]);
    },
    updateState: function (userId, state) {
        var sql = 'update user set state=? where id=?';
        return pool.query(sql, [state, userId]);
    }
};

module.exports = service;
