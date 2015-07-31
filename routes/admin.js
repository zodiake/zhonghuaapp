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
var adminTabData = require('../adminTabData');
var commonTabData = require('../commonTabData');

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
    if (req.user.authority !== userAuthority.admin && req.user.authority !== userAuthority.common) {
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
        var ceOrCr = role == userAuthority.consignee;
        q.all([userService.findByOption(option, pageable, ceOrCr), userService.countByOption(option, pageable, ceOrCr)])
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

router.put('/user/state', function (req, res, next) {
    var state = req.body.state,
        userId = req.body.userId;
    console.log(state);
    if (state !== 0 && state !== 1) {
        var err = new Error('state not exist');
        return next(err);
    }

    userService
        .updateState(userId, state)
        .then(function (data) {
            res.json({
                status: 'success'
            });
        })
        .fail(function (err) {
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/csv', fileMulter, function (req, res, next) {
    var file = req.files.file;
    if (file.mimetype != 'text/csv') {
        var err = new Error('please upload csv file');
        return next(err);
    }
    res.json({
        status: 'success',
        data: file.path
    });
});

/*----------------------scrollImage------------------------------------*/
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
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });
});
/*----------------------end scrollImage-------------------------------*/

/*------------------------------orders-------------------------------*/
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
        .innerJoinUser(orderId)
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

router.put('/orders/:id', function (req, res, next) {
    var orderId = req.params.id,
        company_name = req.body.company_name,
        category = req.body.category,
        cargoo_name = req.body.cargoo_name,
        origin = req.body.origin,
        destination = req.body.destination,
        etd = req.body.etd,
        quantity = req.body.quantity;
    var order = {
        category: category,
        cargoo_name: cargoo_name,
        origin: origin,
        destination: destination,
        etd: etd,
        quantity: quantity,
        company_name: company_name
    };
    console.log(order);

    orderService
        .update(order, orderId)
        .then(function (data) {
            res.json({
                status: 'success',
            });
        })
        .fail(function (err) {
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/aggregate/orders', function (req, res) {
    orderService
        .aggregate()
        .then(function (result) {
            res.json({
                'all': result[0][0].countNum,
                'app': result[1][0].countNum,
                'out': result[2][0].countNum,
                'dispatch': result[3][0].countNum,
                'confirm': result[4][0].countNum,
                'transport': result[5][0].countNum,
                'arrive': result[6][0].countNum,
                'appraise': result[7][0].countNum,
                'refuse': result[8][0].countNum,
            });
        });
});
/*------------------------end  orders-------------------------------*/

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
            return next(err);
        })
        .catch(function (err) {
            return next(err);
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
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });
});

function render(path) {
    router.get('/' + path + '.html', function (req, res) {
        res.render(path);
    });
}

router.get('/tabData', function (req, res) {
    var authority = req.user.authority;
    if (authority == userAuthority.admin) {
        res.json(adminTabData);
    } else {
        res.json(commonTabData);
    }

});

render('tabs');
render('consignor');
render('order');
render('orderDetail');
render('map');
render('import');
render('scrollImage');
render('cargoo');
render('consignee');
render('recommand');
render('user');
render('orderReport');
render('message');
render('scrollImageAdd');
render('cargooAdd');
render('recommandDetail');

module.exports = router;
