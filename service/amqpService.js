/*jslint node: true */
'use strict';
var amqp = require('amqp');
var categoryService = require('../service/categoryService');
var orderService = require('../service/orderService');

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
                var order = {
                    consignor: message.user_mobile,
                    created_time: message.order_time,
                    order_number: message.order_id,
                    license: message.license,
                    consignee_name: message.driver_name,
                    consignee: message.driver_mobile,
                    company_name: message.company_name,
                    cargoo_name: message.cargoo_name,
                    destination: message.destination,
                    origin: message.origin,
                    etd: message.eta,
                    quantity: message.quantity,
                    type: message.type,
                    app_or_out: 0
                };
                categoryService
                    .findByName(order.cargoo_name)
                    .then(function (data) {
                        order.cargoo_name = data.id;
                        order.category = data.parent_id;
                        return order;
                    })
                    .then(function (order) {
                        orderService.save(order);
                    })
                    .fail(function (err) {
                        console.log(err);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
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
