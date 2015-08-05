/*jslint node: true */
'use strict';
var pool = require('../utils/pool');

var service = {
    findAll: function () {
        var sql = 'select * from scroll_image';
        return pool.query(sql, []);
    },
    update: function (id, image) {
        var sql = 'update scroll_image set image_href=? ,updated_time=? where id=?';
        return pool.query(sql, [image.href, image.updated_time, id]);
    }
};

module.exports = service;
