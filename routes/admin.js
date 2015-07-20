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
var scrollImageService = require('../service/scrollImageService');

var userAuthority = require('../userAuthority');
var orderState = require('../orderState');
var config = require('../config');

router.use(e_jwt({
    secret: config.key
}));

var fileMulter = multer({
    dest: './uploads/',
    group: {
        csv: './csv',
        image: './public/uploads'
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
                quantity: Number(data[8])
            };
            result.row = parser.count;
            return result;
        }
        return null;
    });

    var validate = csv.transform(function (data) {
        function socketEmitFail(data, message) {
            data.message = message;
            nsp.to(req.user.name).emit('fail', data);
            return null;
        }

        function lengthValidate(data) {
            /*
            if (data.mobile.length != 11) {
                socketEmitFail(data, 'mobile shoule 11');
            }
            */
            if (data.licence.length > 7) {
                socketEmitFail(data, 'licence less than 11');
            }
            if (data.origin.length > 50) {
                socketEmitFail(data, 'origin less then 10');
            }
            if (data.destination.length > 50) {
                socketEmitFail(data, 'destination less then 10');
            }
            if (_.isNaN(data.quantity)) {
                socketEmitFail(data, 'quantity should be number');
            }
        }

        function requiredValidate(data) {
            if (!data.licence) {
                socketEmitFail(data, 'licence can not be null');
            }
            if (!data.mobile) {
                socketEmitFail(data, 'mobile can not be null');
            }
            if (data.category && !data.cargoo_name) {
                socketEmitFail(data, 'set category should set cargoo_name');
            }
            if (data.cargoo_name && !data.category) {
                socketEmitFail(data, 'set cargoo_name should set category');
            }
        }

        if (data) {
            requiredValidate(data);
            lengthValidate(data);
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
                    if (data.category) {

                    }

                    if (total && data.row == total) {
                        nsp.to(req.user.name).emit('finish', {
                            rows: parser.count
                        });
                    }
                    if (data.consignee) {
                        //todo insert into order
                    } else {
                        data.message = 'can not find consignee';
                        nsp.to(req.user.name).emit('fail', data);
                    }
                })
                .fail(function (err) {
                    data.message = err.message;
                    nsp.to(req.user.name).emit('fail', data);
                })
                .catch(function (err) {
                    data.message = err.message;
                    nsp.to(req.user.name).emit('fail', data);
                });
        }
    });


    nsp.on('connection', function (socket) {
        socket.join(req.user.name);
        fs.createReadStream(path).pipe(parser).pipe(extract).pipe(validate).pipe(findConsignee);
    });

    res.json('ok');
});

router.post('/csv/upload', fileMulter, function (req, res) {});

router.post('/scrollImages', fileMulter, function (req, res) {
    var file = req.files.file;
    res.json(file.path);
});

router.get('/scrollImages', function (req, res, next) {
    scrollImageService
        .findAll()
        .then(function (data) {
            res.json({
                status: 'success',
                data: data
            });
        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        })
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
