/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var e_jwt = require('express-jwt');
var multer = require('multer');
var q = require('q');

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
            var remote = [];
            var transportData = _.chain(data)
                .filter(function(d) {
                    return d.current_state == orderState.transport && d.type;
                })
                .groupBy(function(d) {
                    return d.type;
                }).value();
            for (var i in transportData) {
                var query = orderService.convertArrayToString(transportData[i]);
                remote.push(webService.queryFromWeb(i, query));
            }
            return q.all(remote).then(function(result) {
                _.forEach(result, function(r) {
                    if (r.status == 'success') {
                        orderService.merge(r.data, data);
                    }
                });
                return data;
            });
        }).then(function(data) {
            res.json({
                status: 'success',
                data: data
            });
        }).catch(function(err) {
            return next(err);
        });
});

//getone
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    orderService
        .findOneAndState(req.user, id)
        .then(function(data) {
            var state = [];
            var result;
            if (data.length > 0) {
                result = {
                    id: data[0].id,
                    order_id: data[0].order_id,
                    license: data[0].license,
                    consignor: data[0].consignor,
                    consignee: data[0].consignee,
                    companyName: data[0].company_name,
                    category: data[0].category,
                    cargooName: data[0].cargoo_name,
                    origin: data[0].origin,
                    destination: data[0].destination,
                    quantity: data[0].quantity,
                    currentState: data[0].current_state,
                    createdTime: data[0].created_time
                };
                data.forEach(function(d) {
                    state.push({
                        stateName: d.state_name,
                        createTime: d.created_time
                    });
                });
            }
            result.states = state;
            res.json({
                status: 'success',
                data: result
            });
        }).catch(function(err) {
            return next(err);
        });
});

function insert(state) {
    return function(req, res, next) {
        var license = req.body.license,
            mobile = req.body.mobile,
            consigneeName = req.body.consigneeName,
            companyName = req.body.companyName,
            category = req.body.category,
            cargooName = req.body.cargooName,
            origin = req.body.origin,
            destination = req.body.destination,
            etd = req.body.etd,
            quantity = req.body.quantity;

        var order = {
            license: license,
            mobile: mobile,
            consignee_name: consigneeName,
            company_name: companyName,
            category: category,
            cargoo_name: cargooName,
            origin: origin,
            destination: destination,
            etd: etd,
            quantity: quantity,
            createdTime: new Date(),
            state: state
        };

        orderService
            .save(order)
            .then(function(resultId) {
                res.json({
                    status: 'success',
                    data: resultId
                });
            })
            .catch(function(err) {
                return next(err);
            });
    };
}

//insert dispatch
router.post('/dispatch', insert('dispatch'));

//insert confirm
router.post('/confirm', insert('confirm'));

//update state
var verifyUsrAndState = function(req, res, next) {
    var authority = req.user.authority,
        state = req.body.state,
        id = req.user.id;
};

router.put('/:id/state', function(req, res, next) {
    var state = req.body.state,
        id = req.params.id;
    if (!orderState[state]) {
        var err = new Error('state can not be null');
        return next(err);
    }
});

//update
router.put('/:id', function(req, res, next) {
    var state = req.body.state,
        id = req.params.id;
    if (!orderState[state]) {
        new Error('state ')
    }

    orderService.updateState({
        id: id,
        state: orderState[state]
    });
    res.json({
        status: 'success',
        data: 'todo'
    });
});

router.post('/:id/upload', fileMulter, function(req, res) {
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
