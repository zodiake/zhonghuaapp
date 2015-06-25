var pool = require('../utils/pool');

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
    countByMobile: function(mobile) {
        return pool.query('select count(*) as usrCount from usr where mobile=?', [mobile]);
    },
    save: function(usr) {
        var sql = 'insert into usr(name,password,authority) values(?,?,?)';
        return pool.insert(sql, [usr.name, usr.password, usr.type]);
    }
};

module.exports = service;
