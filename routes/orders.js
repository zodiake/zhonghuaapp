var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var orderService = require('../service/orderService');
var config = require('../config');

router.use(e_jwt({
    secret: config.key
}));

router.get('/', function(req, res) {
    var page = req.query.page || 1,
        size = req.query.size || 10,
        state = req.query.state || 'all';
    var pageable = {
        page: page - 1,
        size: size
    };
    orderService
        .findByUsrAndState(req.user.id, state, pageable)
        .then(function(data) {
            res.json(data);
        });
});

module.exports = router;
