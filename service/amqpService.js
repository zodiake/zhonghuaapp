/*jslint node: true */
'use strict';
var amqp = require('amqp');
var pool = require('../utils/pool');

var connection = amqp.createConnection({
    url: 'amqp://guest:guest@localhost:5672/zhonghua'
});

connection.on('ready', function () {
    var exchange = connection.exchange('order-exchange', {
        autoDelete: false
    });
    /*-----------------orderCreate queue----------------------------*/
    connection.queue('orderCreate-queue', {
            autoDelete: false
        },
        function (q) {
            q.bind(exchange, 'order.create');
            q.subscribe(exchange, function (message, headers, deliveryInfo, messageObject) {
                console.log('Got a message with routing key ' + deliveryInfo.routingKey);
                console.log('object:', message);
                var order = {
                    order_number: message.order_id,
                    created_time: message.order_time,
                    license: message.license,
                    consignee_name: message.driver_name,
                    destination: message.destination,
                    etd: message.eta,
                    quantity: message.quantity,
                    type: message.type,
                    origin: message.origin
                };

            });
        });
    /*-----------------orderUpdate queue----------------------------*/
    connection.queue('orderUpdate-queue', {
        autoDelete: false
    }, function (q) {
        q.bind(exchange, 'order.update');
        q.subscribe(exchange, function (message, headers, deliveryInfo, messageObject) {
            console.log('Got a message with routing key ' + deliveryInfo.routingKey);
            console.log('object:', message);
        });
    });
    /*-----------------orderDelete queue----------------------------*/
    connection.queue('orderDelete-queue', {
        autoDelete: false
    }, function (q) {
        q.bind(exchange, 'order.delete');
        q.subscribe(exchange, function (message, headers, deliveryInfo, messageObject) {
            console.log('Got a message with routing key ' + deliveryInfo.routingKey);
            console.log('object:', message);
        });
    });
    /*-----------------orderState queue----------------------------*/
    connection.queue('orderstate-queue', {
        autoDelete: false
    }, function (q) {
        q.bind(exchange, 'orderstate.create');
        q.subscribe(exchange, function (message, headers, deliveryInfo, messageObject) {
            console.log('Got a message with routing key ' + deliveryInfo.routingKey);
            console.log('object:', message);
        });
    });
});

module.exports = connection;
