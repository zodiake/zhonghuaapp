var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var orderService = require('../service/orderService');
var config = require('../config');
var webService = require('../service/webService');
var orderState = require('../orderState');
var userAuthority = require('../userAuthority');
var positionService = require('../service/positionService');
var _ = require('lodash');

router.use(e_jwt({
    secret: config.key
}));

//list
router.get('/', function(req, res, next) {
    var page = req.query.page || 1,
        size = req.query.size || 10,
        state = orderState[req.query.state] || 'all',
        user = req.user;

    var pageable = {
        page: page - 1,
        size: size
    };

    orderService
        .findByUsrAndState(user, state, pageable)
        .then(function(data) {
            //todo needed to group by type and merge results
            var query = orderService.convertArrayToString(data);
            return webService.queryFromWeb(query).then(function(serviceData) {
                var result = orderService.merge(serviceData, data);
                res.json({
                    status: 'success',
                    data: result
                })
            });
        }).catch(function(err) {
            return next(err);
        });
});

//getone
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    orderService
        .findByUsrIdAndId(req.user, id)
        .then(function(data) {
            res.json({
                status: 'success',
                data: data[0]
            });
        }).catch(function(err) {
            next(err);
        });
});

//save
router.post('/', function(req, res) {
    var total = req.body.total,
        createdTime = dateFormat(new Date);

    var order = {
        total: total,
        createdTime: createdTime
    };

    orderService
        .save(order)
        .then(function(resultId) {

        });
});

//update
router.post(/\d+/, function(req, res) {
    res.json({
        status: 'success',
        data: 'todo'
    })
});

router.post('/geo', function(req, res, next) {
    var array = req.body;
    if (!_.isArray(array))
        return next(new Error('body not array'));
    _.each(array, function(a) {
        positionService.insert({
            longitude: a.longitude,
            latitude: a.latitude,
            order_id: a.orderId,
            created_time: new Date()
        });
    });
    res.json({
        status: 'success'
    });
});

module.exports = router;
