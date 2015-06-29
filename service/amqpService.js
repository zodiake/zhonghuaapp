var amqp = require('amqp');

var connection = amqp.createConnection({
    url: "amqp://guest:guest@localhost:5672/zhonghua"
});

connection.on('ready', function() {
    var exchange = connection.exchange('test-exchange', {
        autoDelete: false
    });
    connection.queue('test-queue', {
            autoDelete: false
        },
        function(q) {
            q.bind(exchange, 'order.create');
            q.subscribe(exchange, function(message, headers, deliveryInfo, messageObject) {
                console.log('Got a message with routing key ' + deliveryInfo.routingKey);
                console.log('object:' + messageObject);
            });
        });
});

module.exports = connection;
