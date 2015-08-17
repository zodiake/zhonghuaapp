/*jslint node: true */
'use strict';
var winston = require('winston');

var logger = new(winston.Logger)({
    exitOnError: false,
    transports: [
        new(winston.transports.DailyRotateFile)({
            filename: 'applog.log'
        }),
        new(winston.transports.Console)({
            colorize: true,
        })
    ]
});

module.exports = logger;
