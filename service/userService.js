var pool = require('../utils/pool');
var squel = require("squel");

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
    findByOption: function(option, page) {
        var sql = squel.select().from('usr')
        pool.buildSql(sql, option);
        return pool.query(sql.toString(), []);
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
