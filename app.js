/*-------------express deprends-----------*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*--------------custom routes------------*/
var routes = require('./routes/index');
var users = require('./routes/users');
var orders = require('./routes/orders');
var suggestions = require('./routes/suggestion');
var vehicle = require('./routes/vehicle');

/*---------------amqp---------------------*/
var queue = require('./service/amqpService');

var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/orders', orders);
app.use('/suggestions', suggestions);
app.use('/vehicle', vehicle);

//just test remote web service should deleted from productd
if (app.get('env') === 'development') {
    var proxy = require('./routes/proxy');
    app.use('/proxy', proxy);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.json({
                status: 'fail',
                message: 'invalid request'
            });
        } else if (err.name === 'TokenExpiredError') {
            res.json({
                status: 'fail',
                message: 'token expire'
            });
        } else {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.json({
            status: 'fail',
            message: 'invalid request'
        });
    } else if (err.name === 'TokenExpiredError') {
        res.json({
            status: 'fail',
            message: 'token expire'
        });
    } else {
        res.status(err.status || 500).json({
            status: 'fail',
            message: err.message
        });
    }
});

module.exports = app;
