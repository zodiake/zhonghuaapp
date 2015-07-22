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

router.put('/user/:state', function (req, res, next) {
    var state = req.params.state;
    if (state != 0 || state != 1) {
        var err = new Error('state not exist');
        next(err);
    }

});

router.post('/csv', fileMulter, function (req, res) {
    var file = req.files.file;
    res.json(file.path);
});

router.get('/csv', function (req, res, next) {

    var nsp = req.io.of('/upload');

    var parser = csv.parse();

    var total;

    parser.on('error', function (err) {
        console.log('error:', err.message);
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
                etd: Date.parse(data[7]),
                quantity: Number(data[8])
            };
            result.row = parser.count;
            return result;
        }
        return null;
    });

    function socketEmitFail(data, message) {
        data.message = message;
        nsp.to(req.user.name).emit('fail', data);
        data.error = true;
        return data;
    }

    var validate = csv.transform(function (data) {
        function lengthValidate(data) {
            /*
            if (data.mobile.length != 11) {
                socketEmitFail(data, 'mobile shoule 11');
            }
            */
            if (data.licence.length > 7) {
                return socketEmitFail(data, 'licence less than 11');
            }
            if (data.origin.length > 50) {
                return socketEmitFail(data, 'origin less then 10');
            }
            if (data.destination.length > 50) {
                return socketEmitFail(data, 'destination less then 10');
            }
            if (_.isNaN(data.quantity)) {
                return socketEmitFail(data, 'quantity should be number');
            }
        }

        function requiredValidate(data) {
            if (!data.licence) {
                return socketEmitFail(data, 'licence can not be null');
            }
            if (!data.mobile) {
                return socketEmitFail(data, 'mobile can not be null');
            }
            if (data.category && !data.cargoo_name) {
                return socketEmitFail(data, 'set category should set cargoo_name');
            }
            if (data.cargoo_name && !data.category) {
                return socketEmitFail(data, 'set cargoo_name should set category');
            }
        }

        function dateValidate(data) {
            if (_.isNaN(data.etd)) {
                return socketEmitFail(data, 'set cargoo_name should set category');
            }
        }

        if (data) {
            dateValidate(data);
            requiredValidate(data);
            lengthValidate(data);
            return data;
        }
    });

    var findConsignee = csv.transform(function (data) {

        function convertConsignee(result) {
            if (result.length > 0) {
                data.consignee = result[0].id;
                return data;
            } else {
                return socketEmitFail(data, 'can not find consignee');
            }
        }

        function convertCategory(result) {
            if (!result.error && result.category) {
                return categoryService
                    .findByName(result.category)
                    .then(function (data) {
                        if (data) {
                            result.category = data.name;
                            return result;
                        } else {
                            return socketEmitFail(result, 'can not find catgory');
                        }
                    });
            } else {
                return result;
            }
        }

        function convertCargooName(result) {
            if (!result.error && result.cargoo_name) {
                return categoryService
                    .findByName(result.cargoo_name)
                    .then(function (data) {
                        if (data.length > 0) {
                            result.cargoo_name = data.name;
                            return result;
                        } else {
                            return socketEmitFail(data, 'can not find cargoo_name');
                        }
                    });
            } else {
                return result;
            }
        }

        if (data) {
            userService
                .findByName(data.mobile)
                .then(convertConsignee)
                .then(convertCategory)
                .then(convertCargooName)
                .then(function (data) {
                    if (total && data.row == total) {
                        nsp.to(req.user.name).emit('finish', parser.count);
                    }
                })
                .fail(function (err) {
                    console.log('fail', err);
                    data.message = err.message;
                    nsp.to(req.user.name).emit('fail', data);
                })
                .catch(function (err) {
                    console.log('err', err);
                    data.message = err.message;
                    nsp.to(req.user.name).emit('fail', data);
                });
        }
    });


    nsp.on('connection', function (socket) {
        socket.join(req.user.name);
        socket.on('begin', function (data) {
            var path = join(__dirname, '..', data.file);
            fs.createReadStream(path).pipe(parser).pipe(extract).pipe(validate).pipe(findConsignee);
        });
    });

    res.json('ok');
});

//router.post('/csv/upload', fileMulter, function (req, res) {});

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
        });
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
