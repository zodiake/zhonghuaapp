var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var e_jwt = require('express-jwt');
var orderService = require('../service/orderService');
var config = require('../config');
var webService = require('../service/webService');

var orderState = {
    transport: '运送中',
    dispatch: '待分配',
    confirm: '待确认',
    arrive: '已送达',
    appraise: '已评价'
};

var dateFormat = function(date) {
    var year = date.getYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
    var array = [year, month, day, hour, minute, second];
    return array.join("-");
}

router.use(e_jwt({
    secret: config.key
}));

//list
router.get('/', function(req, res) {
    var page = req.query.page || 1,
        size = req.query.size || 10,
        state = orderState[req.query.state] || 'all';

    var pageable = {
        page: page - 1,
        size: size
    };

    if (state == 'all' || state == orderState.transport) {
        orderService
            .findByUsrAndState(req.user.id, state, pageable)
            .then(function(data) {
                var query = orderService.convertArrayToString(data);
                var defer = webService.queryFromWeb(query);
                defer.then(function(serviceData) {
                    var resultData = orderService.merge(serviceData, data);
                    var result = {
                        status: 'success',
                        data: resultData
                    };
                    res.json(result);
                });
            }).catch(function(err) {
                res.json({
                    status: 'fail',
                    err: err
                });
            });
    } else {
        orderService
            .findByUsrAndState(req.user.id, state, pageable)
            .then(function(data) {
                result = {
                    status: 'success',
                    data: data
                };
                res.json(result);
            }).catch(function(err) {
                result = {
                    status: 'fail',
                    err: err
                };
                res.json(result);
            });
    }
});

//getone
router.get('/:id', function(req, res) {
    var id = req.params.id;
    orderService
        .findByUsrIdAndId(req.user.id, id)
        .then(function(data) {
            res.json(data[0]);
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
router.post('/:id', function(req, res) {

});

module.exports = router;
