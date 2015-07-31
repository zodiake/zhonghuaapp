/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var amqp = require('amqp');
var soap = require('soap');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
shasum.update('123');
var url = 'http://112.33.1.13/jaxws/smsServiceEndpoint/sendSms?wsdl';

var connection = amqp.createConnection({
    url: 'amqp://guest:guest@localhost:5672/zhonghua'
});

router.get('/', function (req, res) {
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

router.get('/sms', function (req, res) {
    var args = {
        mobiles: '13611738422',
        content: 'hahaha',
        sign: '',
        addSerial: ''
    };
    var wsdlOptions = {
        attributesKey: '$attributes'
    };
    soap.createClient(url, wsdlOptions, function (err, client) {
        //var pwd = shasum.digest('hex');
        client.sendSms(args, function (err, result) {
            console.log(client.lastRequest);
        });
    });
    res.json('ok');
});

router.get('/amqp', function (req, res) {
    var exchange = connection.exchange('order-exchange', {
        autoDelete: false,
    });
    exchange.publish('order.create', {
        id: 1,
        name: 'tom'
    }, {
        contentType: 'application/json'
    });
    exchange.publish('order.update', {
        id: 2,
        name: 'peter'
    }, {
        contentType: 'application/json'
    });
    exchange.publish('order.delete', {
        id: 3
    }, {
        contentType: 'application/json'
    });
    exchange.publish('orderstate.create', {
        state: 'aa',
        type: 8822
    }, {
        contentType: 'application/json'
    });
    res.json('ok');
});

module.exports = router;
