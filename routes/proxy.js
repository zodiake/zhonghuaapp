var express = require('express');
var router = express.Router();
var amqp = require('amqp');

var connection = amqp.createConnection({
    url: "amqp://guest:guest@localhost:5672/zhonghua"
});

router.get('/', function(req, res) {
    res.status(200).json([{
        id: 1,
        status: 'success',
        state: 'a',
        vehicle: 2
    }, {
        id: 2,
        status: 'success',
        state: 'b',
        vehicle: 2
    }, {
        id: 3,
        status: 'success',
        state: 'c',
        vehicle: 2
    }, {
        id: 4,
        status: 'success',
        state: 'd',
        vehicle: 2
    }, {
        id: 5,
        status: 'success',
        state: 'a',
        vehicle: 2
    }, {
        id: 6,
        status: 'success',
        state: 'b',
        vehicle: 2
    }]);
});

router.get('/:id', function(req, res) {
    res.json({
        order_id: '1',
        waiting: '4',
        status: true
    });
});

router.get('/amqp', function(req, res) {
    var exchange = connection.exchange('test-exchange', {
        autoDelete: false,
    });
    exchange.publish('order.create', {
        id: 1,
        name: 'tom'
    }, {
        contentType: 'application/json'
    });
    res.json('ok');
});

module.exports = router;
