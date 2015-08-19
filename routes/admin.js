/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var e_jwt = require('express-jwt');
var multer = require('multer');
var q = require('q');
var _ = require('lodash');
var path = require('path');

var orderService = require('../service/orderService');
var userService = require('../service/userService');
var categoryService = require('../service/categoryService');
var suggestionService = require('../service/suggestService');
var scrollImageService = require('../service/scrollImageService');
var questionService = require('../service/questionService');
var jpush = require('../service/jpush');

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
        var ceOrCr = role === userAuthority.consignee;
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
    if (file.mimetype !== 'text/csv') {
        var err = new Error('please upload csv file');
        return next(err);
    }
    res.json({
        status: 'success',
        data: file.path
    });
});

/*----------------------scrollImage------------------------------------*/
router.post('/scrollImages', fileMulter, function (req, res, next) {
    var file = req.files.file,
        id = req.body.id;

    var urlPath = file.path.split(path.sep).slice(1).join('/');
    console.log(urlPath.length);
    console.log(urlPath);
    scrollImageService
        .updateUrl(id, {
            url: urlPath,
            updated_time: new Date()
        })
        .then(function (data) {
            res.json(file.path);
        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
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

router.put('/scrollImages/:id', function (req, res, next) {
    var id = req.params.id,
        href = req.body.image_href,
        item = {
            href: href,
            updated_time: new Date()
        };

    scrollImageService
        .updateHref(id, item)
        .then(function (data) {
            if (data.changedRows == 1) {
                res.json({
                    status: 'success',
                    data: item
                });
            }
        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });

});
/*----------------------end scrollImage-------------------------------*/

/*------------------------------orders-------------------------------*/
router.get('/orders', function (req, res, next) {
    var page = req.query.page || 1,
        size = req.query.size || 15,
        consignor = req.query.consignor,
        beginTime = req.query.beginTime,
        endTime = req.query.endTime,
        orderNumber = req.query.orderNumber,
        state = req.query.state;
    var option = {
        consignor: consignor,
        beginTime: beginTime,
        endTime: endTime,
        order_number: orderNumber
    };

    if (state !== undefined && orderState[state] !== undefined) {
        option.current_state = orderState[state];
    }
    var pageable = {
        page: page,
        size: size
    };
    orderService
        .findByOption(pageable, option)
        .then(function (result) {
            console.log(result);
            res.json({
                status: 'success',
                data: {
                    total: result[0][0].countNum,
                    data: result[1]
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
        quantity = req.body.quantity,
        user = req.user;
    var order = {
        category: category,
        cargoo_name: cargoo_name,
        origin: origin,
        destination: destination,
        etd: etd,
        quantity: quantity,
        company_name: company_name
    };

    orderService
        .update(order, orderId, user)
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
                'refuse': result[8][0].countNum
            });
        });
});
/*------------------------end  orders-------------------------------*/

/*------------------------category begin----------------------------*/
router.get('/category', function (req, res, next) {
    categoryService
        .adminFindAll()
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

router.post('/category', function (req, res, next) {
    var parent_id = req.body.category,
        name = req.body.name;

    categoryService
        .save({
            parent_id: parent_id,
            name: name,
            activate: 1
        })
        .then(function (date) {
            if (date.insertId) {
                res.json({
                    status: 'success'
                });
            } else {
                res.json({
                    status: 'fail'
                });
            }
        })
        .fail(function (err) {
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.put('/category/state', function (req, res, next) {
    var state = req.body.state,
        categoryId = req.body.id;
    if (state !== 0 && state !== 1) {
        var err = new Error('state not exist');
        return next(err);
    }

    categoryService
        .updateState(categoryId, state)
        .then(function (data) {
            categoryService.clearCache();
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

router.get('/category/:id', function (req, res, next) {
    var id = req.params.id;
    categoryService
        .findOne(id)
        .then(function (data) {
            res.json({
                status: 'success',
                data: data[0]
            });
        })
        .fail(function (err) {
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });

});

router.put('/category/:id', function (req, res, next) {
    var id = req.params.id,
        category = req.body.category,
        name = req.body.name;

    categoryService
        .update(id, {
            category: category,
            name: name
        })
        .then(function (data) {
            if (data.changedRows === 1) {
                res.json({
                    status: 'success'
                });
            } else {
                res.json({
                    status: 'fail'
                });
            }
        })
        .fail(function (err) {
            return next(err);
        })
        .catch(function (err) {
            return next(err);
        });
});
/*------------------------end category-------------------------------*/

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

router.post('/jpush', function (req, res, next) {
    var type = req.body.type,
        content = req.body.content;
    jpush(type, content, function (err) {
        if (err) {
            var error = new Error('send fail');
            return next(error);
        }
        res.json({
            status: 'success'
        });
    });
});

router.get('/tabData', function (req, res) {
    var authority = req.user.authority;
    if (authority === userAuthority.admin) {
        res.json(adminTabData);
    } else {
        res.json(commonTabData);
    }

});

/*------------------------begin question-------------------------------*/
router.get('/questions', function (req, res, next) {
    var page = req.params.page || 1,
        size = req.params.size || 15;
    questionService
        .findAll()
        .then(function (data) {

        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
});

router.post('/questions', function (req, res, next) {
    var question = req.body.question,
        answer = req.body.answer;
    questionService
        .save({
            question: question,
            answer: answer
        })
        .then(function (data) {

        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
});

router.put('/questions/:id', function (req, res, next) {
    var question = req.body.question,
        answer = req.body.answer,
        id = req.params.id;
    questionService
        .update(id, {
            question: question,
            answer: answer
        })
        .then(function (data) {

        })
        .fail(function (err) {
            next(err);
        })
        .catch(function (err) {
            next(err);
        });
});
/*------------------------end question-------------------------------*/
function render(path) {
    router.get('/' + path + '.html', function (req, res) {
        res.render(path);
    });
}

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
render('question');
render('cargooDetail');

module.exports = router;
