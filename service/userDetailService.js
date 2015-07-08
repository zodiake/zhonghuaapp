/*jslint node: true */
'use strict';
var pool = require('../utils/pool');

var service = {
    findOne: function(id) {
        var sql = 'select * from usr_detail where id=?';
        return pool.query(sql, [id]);
    },
    save: function(details) {
        var sql = 'insert into usr_detail set ?';
        return pool.insert(sql, details);
    },
    update: function(details) {
        var sql = 'update usr_detail set detail_name=?,gender=?,identified_number=?,company_name1=?,company_name2=?,company_name3=? where id=?';
        return pool.update(sql, [details.name, details.gender, details.identfied_number, details.company_name1, details.company_name2, details.company_name3, details.id]);
    },
    praise: function(id) {
        var sql = 'update usr_detail set praise=praise+1 where id=?';
        return pool.query(sql, [id]);
    }
};

module.exports = service;
