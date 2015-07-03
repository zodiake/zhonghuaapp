/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var e_jwt = require('express-jwt');
var path = require('path');
var fs = require('fs');
var multer = require('multer');

var orderService = require('../service/orderService');
var webService = require('../service/webService');
var reviewService = require('../service/reviewService');

var orderState = require('../orderState');
var positionService = require('../service/positionService');
var _ = require('lodash');
var config = require('../config');

router.use(e_jwt({
    secret: config.key
}));

var fileMulter = multer({
    dest: './uploads/',
    group: {
        image: './public/uploads'
    }
});

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
                });
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
            var result = data[0] || {};
            res.json({
                status: 'success',
                data: result
            });
        }).catch(function(err) {
            return next(err);
        });
});

//save new
router.post('/', function(req, res) {
    var total = req.body.total;

    var order = {
        total: total,
        createdTime: new Date()
    };

    orderService
        .save(order)
        .then(function(resultId) {

        });
});

//update
router.put('/:id', function(req, res) {
    res.json({
        status: 'success',
        data: 'todo'
    });
});

router.post('/:id/upload', fileMulter, function(req, res, next) {
    var file = req.files.file;
    res.json({
        status: 'success',
        data: file.path
    });
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

router.get('/geo', function(req, res, next) {

});

router.post('/:id/reviews', function(req, res, next) {
    var orderId = req.params.id,
        desc = req.body.desc,
        level = req.body.level,
        userId = req.user.id;

    reviewService
        .countByOrder(orderId)
        .then(function(data) {
            if (data[0].countNum === 0) {
                var review = {
                    description: desc,
                    order_id: orderId,
                    level: level,
                    consignor: userId
                };
                return reviewService.save(review);
            } else {
                return -1;
            }
        })
        .then(function(data) {
            //insert success data is the return id
            if (data > 1) {
                res.json({
                    status: 'success'
                });
            } else if (data == -1) {
                //the order has been reviewed
                res.json({
                    status: 'fail',
                    message: 'already reviewed'
                });
            } else {
                //mysql error
                res.json({
                    status: 'fail',
                    message: 'review fail'
                });
            }
        })
        .catch(function(err) {
            return next(err);
        });
});

module.exports = router;
