/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var e_jwt = require('express-jwt');
var csv = require('csv');
var multer = require('multer');
var q = require('q');
var _ = require('lodash');

var fs = require('fs');
var join = require('path').join;

var orderService = require('../service/orderService');
var userService = require('../service/userService');
var pool = require('../utils/pool');
var categoryService = require('../service/categoryService');
var suggestionService = require('../service/suggestService');

var userAuthority = require('../userAuthority');
var orderState = require('../orderState');
var config = require('../config');

router.use(e_jwt({
    secret: config.key
}));

var fileMulter = multer({
    dest: './uploads/',
    group: {
        csv: './csv'
    }
});

router.use(function (req, res, next) {
    if (req.user.authority !== userAuthority.admin) {
        var err = new Error();
        err.name = 'UnauthorizedError';
        return next(err);
    }
    next();
});

var usrCall = function (role) {
    return function (req, res, next) {
        var pageable = {
            page: req.query.page - 1 || 0,
            size: req.query.size || 15
        };
        var option = {
            name: req.query.mobile,
            activate: req.query.activate,
            authority: role
        };
        q.all([userService.findByOption(option, pageable), userService.countByOption(option, pageable)])
            .then(function (result) {
                res.json({
                    status: 'success',
                    data: {
                        totol: result[1][0].countNum,
                        data: result[0]
                    }
                });
            })
            .catch(function (err) {
                return next(err);
            });
    };
};

router.get('/consignor', usrCall(userAuthority.consignor));

router.get('/consignee', usrCall(userAuthority.consignee));

router.get('/csvtest', function (req, res, next) {
    var path = join(__dirname, '../csv/1.csv');

    var nsp = req.io.of('/upload');

    var parser = csv.parse();

    var total;

    parser.on('error', function (err) {
        console.log(err.message);
        console.log(parser.count);
    });

    parser.on('finish', function () {
        total = parser.count;
    });

    var extract = csv.transform(function (data) {
        if (parser.count > 1) {
            var result = {
                mobile: data[0],
                licence: data[1],
                consignee_name: data[2],
                category: data[3],
                cargoo_name: data[4],
                origin: data[5],
                destination: data[6],
                etd: data[7],
                quantity: data[8]
            };
            result.row = parser.count;
            return result;
        }
        return null;
    });

    var validate = csv.transform(function (data) {
        if (data) {
            /*
             if (data.mobile && data.mobile.length !== 11) {
             console.log(parser.count);
             return null;
             }
             */
            if (data.mobile === null || data.licence === null) {
                return null;
            }
            return data;
        }
        return null;
    });

    var findConsignee = csv.transform(function (data) {
        if (data) {
            userService
                .findByName(data.mobile)
                .then(function (result) {
                    if (result.length > 0) {
                        data.consignee = result[0].id;
                    }
                    return data;
                })
                .then(function (data) {
                    if (total && data.row == total) {
                        nsp.to(req.user.name).emit('finish', {
                            rows: parser.count
                        });
                    }
                    if (data.consignee) {
                        //todo insert into order
                    } else {
                        nsp.to(req.user.name).emit('hi', data);
                    }
                })
                .fail(function (err) {})
                .catch(function (err) {});
        }
    });


    nsp.on('connection', function (socket) {
        socket.join(req.user.name);
        fs.createReadStream(path).pipe(parser).pipe(extract).pipe(validate).pipe(findConsignee);
    });

    res.json('ok');
});

router.post('/csv/upload', fileMulter, function (req, res) {
    if (req.files && req.files.file.mimetype === 'text/csv') {
        //var path = join(__dirname, '..', req.files.file.path);
        var path = join(__dirname, '../csv/1.csv');

        var parser = csv.parse();
        parser.on('error', function (err) {
            console.log(err.message);
        });
        var extract = csv.transform(function (data) {
            var result = {
                mobile: data[0],
                licence: data[1],
                consignee_name: data[2],
                category: data[3],
                cargoo_name: data[4],
                origin: data[5],
                destination: data[6],
                etd: data[7],
                quantity: data[8]
            };
            return result;
        });

        var validate = csv.transform(function (data) {
            if (data.mobile && data.mobile.length !== 11) {
                console.log(parser.count);
                return null;
            }
            if (data.mobile === null || data.licence === null) {
                console.log(parser.count);
                return null;
            }
            return data;
        });

        var findConsignee = csv.transform(function (data) {
            userService
                .findByName(data.mobile)
                .then(function (data) {
                    if (data.length > 0) {
                        data.consignee = data[0].id;
                    } else {

                    }
                    return data;
                })
                .then(function (data) {
                    if (data.consignee) {
                        //todo insert into order
                        console.log('final', data);
                    }
                });
        });

        fs.createReadStream(path).pipe(extract).pipe(validate).pipe(findConsignee);

        res.json('ok');
    } else {
        res.json({
            data: 'csv file please'
        });
    }
});

router.get('/orders', function (req, res, next) {
    var page = req.query.page || 1,
        size = req.query.size || 15,
        mobile = req.query.mobile,
        beginTime = req.query.beginTime,
        endTime = req.query.endTime,
        orderId = req.query.orderId,
        state = req.query.state;
    var option = {
        name: mobile,
        begin_time: {
            operator: '>',
            value: beginTime
        },
        end_time: {
            operator: '<',
            value: endTime
        },
        order_id: orderId
    };

    if (state !== undefined && orderState[state] !== undefined) {
        option.current_state = orderState[state];
    }
    var pageable = {
        page: page,
        size: size
    };
    q.all([orderService.findByOption(pageable, option), orderService.countByOption(pageable, option)])
        .then(function (result) {
            res.json({
                status: 'success',
                data: {
                    total: result[1][0].countNum,
                    data: result[0]
                }
            });
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/orders/:id', function (req, res, next) {
    var orderId = req.params.id;
    orderService
        .findOne(orderId)
        .then(function (data) {
            res.json({
                status: 'success',
                data: data[0]
            });
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/csv', function (req, res, next) {
    var stringfier = csv.stringify({
        rowDelimiter: 'windows',
        columns: ['age', 'name'],
        header: true
    });
    var transformer = csv.transform(function (data) {
        console.log(data);
        return {
            age: data.id,
            name: data.consignee
        };
    });

    res.attachment('test.csv');
    pool.stream('select id,consignee from orders').pipe(transformer).pipe(stringfier).pipe(res);
});

router.get('/category', function (req, res, next) {
    categoryService
        .findAll()
        .then(function (data) {
            var result = _.groupBy(data, function (a) {
                return a.parent_id;
            });
            res.json({
                status: 'success',
                data: result
            });
        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/suggestion', function (req, res, next) {
    var option = {
        beginTime: req.query.beginTime,
        endTime: req.query.endTime,
        state: req.query.state,
        page: req.query.page - 1 || 0,
        size: req.query.size || 15
    };
    q.all([suggestionService.search(option, true), suggestionService.search(option)])
        .then(function (result) {
            res.json({
                status: 'success',
                data: {
                    totol: result[0][0].countNum,
                    data: result[1]
                }
            });
        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
