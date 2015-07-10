/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var e_jwt = require('express-jwt');
var multer = require('multer');
var q = require('q');
var _ = require('lodash');

var orderService = require('../service/orderService');
var webService = require('../service/webService');
var reviewService = require('../service/reviewService');
var userService = require('../service/userService');
var positionService = require('../service/positionService');
var orderStateService = require('../service/orderStateService');

var orderState = require('../orderState');
var userAuthority = require('../userAuthority');
var config = require('../config');
var reasonEnmu = require('../reason');

router.use(e_jwt({
    secret: config.key
}));

var fileMulter = multer({
    dest: './uploads/',
    group: {
        image: './public/uploads'
    }
});

//list
router.get('/', function(req, res, next) {
    var page = req.query.page || 1,
        size = req.query.size || 10,
        state = req.query.state.split(','),
        user = req.user;

    var pageable = {
        page: page - 1,
        size: size
    };


    var states = _.map(state, function(s) {
        return orderState[s];
    });

    orderService
        .findByUsrAndState(user, states, pageable)
        .then(function(data) {
            var flag = data.some(function(d) {
                return d.current_state == orderState.transport && d.type;
            });
            if (flag) {
                var remote = [];
                var filtedData = _.chain(data).filter(function(d) {
                    return d.current_state == orderState.transport && d.type;
                }).groupBy(function(d) {
                    return d.type;
                }).value();

                for (var i in filtedData) {
                    var query = orderService.convertArrayToString(filtedData[i]);
                    remote.push(webService.queryFromWeb(i, query));
                }
                return q.all(remote).then(function(result) {
                    _.forEach(result, function(r) {
                        orderService.merge(r, data);
                    });
                    return data;
                });
            } else {
                return data;
            }
        }).then(function(data) {
            res.json({
                status: 'success',
                data: data
            });
        }).fail(function(err) {
            res.json({
                status: 'fail',
                message: err
            });
        }).catch(function(err) {
            return next(err);
        });
});

//getone
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    orderService
        .findOneAndState(req.user, id)
        .then(function(data) {
            var state = [];
            var result;
            if (data.length > 0) {
                result = {
                    id: data[0].id,
                    order_id: data[0].order_id,
                    license: data[0].license,
                    consignor: data[0].consignor,
                    consignee: data[0].consignee,
                    companyName: data[0].company_name,
                    category: data[0].category,
                    cargooName: data[0].cargoo_name,
                    origin: data[0].origin,
                    destination: data[0].destination,
                    quantity: data[0].quantity,
                    currentState: data[0].current_state,
                    createdTime: data[0].created_time
                };
                data.forEach(function(d) {
                    state.push({
                        stateName: d.state_name,
                        createTime: d.created_time
                    });
                });
            }
            result.states = state;
            res.json({
                status: 'success',
                data: result
            });
        }).catch(function(err) {
            return next(err);
        });
});

var userAuthorityVerify = function() {
    return function(req, res, next) {
        var user = req.user;
        if (user.authority != userAuthority.consignor) {
            var err = new Error('authority should be consignor');
            return next(err);
        }
        next();
    };
};

var extractOrder = function() {
    return function(req, res, next) {
        var license = req.body.license,
            mobile = req.body.mobile,
            consigneeName = req.body.consigneeName,
            companyName = req.body.companyName,
            category = req.body.category,
            cargooName = req.body.cargooName,
            origin = req.body.origin,
            destination = req.body.destination,
            etd = req.body.etd,
            quantity = req.body.quantity,
            state = orderState[req.body.state],
            user = req.user;

        var order = {
            license: license,
            mobile: mobile,
            consignee_name: consigneeName,
            company_name: companyName,
            category: category,
            cargoo_name: cargooName,
            origin: origin,
            destination: destination,
            etd: etd,
            quantity: quantity,
            created_time: new Date(),
            current_state: state,
            consignor: user.id
        };
        req.order = order;
        next();
    };
};

var stateVerify = function() {
    return function(req, res, next) {
        var order = req.order;
        if (order.current_state != orderState.dispatch && order.current_state != orderState.confirm) {
            var err = new Error('state should be dispath or confirm');
            return next(err);
        }
        next();
    };
};

//insert dispatch
router.post('/', userAuthorityVerify(), extractOrder(), stateVerify(), function(req, res, next) {
    var order = req.order;
    userService
        .findByNameAndAuthority(order.mobile, userAuthority.consignee)
        .then(function(data) {
            if (data.length === 0) {
                return null;
            } else {
                order.consignee = data[0].id;
                return orderService
                    .save(order)
                    .then(function(resultId) {
                        return orderStateService.save({
                            order_id: resultId,
                            state_name: orderState.created,
                            created_time: new Date()
                        }).then(function() {
                            return resultId;
                        });
                    });
            }
        })
        .then(function(resultId) {
            if (!resultId) {
                res.json({
                    status: 'fail',
                    message: 'driver not exist'
                });
                return;
            }
            res.json({
                status: 'success',
                data: resultId
            });

        })
        .catch(function(err) {
            return next(err);
        });
});

//update
router.put('/:id', extractOrder(), function(req, res, next) {
    var id = req.params.id;
    var order = req.order;
    delete order.current_state;

    userService
        .findByName(order.mobile)
        .then(function(data) {
            if (data.length === 0) {
                return null;
            } else {
                order.consignee = data[0].id;
                return orderService.update(order, id);
            }
        })
        .then(function(result) {
            res.json({
                status: 'success',
                data: result.changedRows
            });

        })
        .catch(function(err) {
            return next(err);
        });
});

//one consignee can only have one transport order
var verifyState = function() {
    return function(req, res, next) {
        var state = req.body.state,
            user = req.user;
        req.body.state = orderState[state];

        //if state is null throw err
        if (!orderState[state]) {
            var err = new Error('state can not be empty');
            return next(err);
        }
        if (orderState[state] == orderState.transport && user.authority == userAuthority.consignee) {
            orderService
                .countByStateAndConsignee({
                    state: orderState[state],
                    consignee: user.id
                })
                .then(function(data) {
                    if (data[0].countNum > 0) {
                        var err = new Error('already having a transport order');
                        return next(err);
                    } else {
                        next();
                    }
                })
                .catch(function(err) {
                    return next(err);
                });
        } else {
            next();
        }
    };
};

//update state
router.put('/:id/state', verifyState(), function(req, res, next) {
    var state = req.body.state,
        id = req.params.id,
        user = req.user;

    //consignee can only have one transport order
    orderService
        .updateStateByIdAndUser({
            id: id,
            state: state
        }, user)
        .then(function(data) {
            if (data.changedRows > 0) {
                return orderStateService.save({
                    order_id: id,
                    state_name: state,
                    created_time: new Date()
                });
            } else {
                res.json({
                    status: 'fail',
                    message: 'no order updated'
                });
                return;
            }
        })
        .then(function(data) {
            res.json({
                status: 'success'
            });
        })
        .fail(function(err) {
            res.json({
                status: 'fail',
                message: 'sql error'
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

router.post('/:id/refuse', function(req, res, next) {
    var desc = req.body.desc,
        reason = req.body.reason,
        id = req.params.id,
        user = req.user;
    orderService
        .findOne(id)
        .then(function(data) {
            if (data[0].current_state == orderState.confirm) {
                return orderService.updateStateByIdAndUser({
                    id: id,
                    state: orderState.refuse
                }, user);
            }
            return;
        })
        .then(function(data) {
            if (!data) {
                return null;
            }
            var refuse = {
                order_id: id,
                state_name: orderState.refuse,
                refuse_reason: reason,
                refuse_desc: desc,
                created_time: new Date()
            };
            return orderStateService.save(refuse);
        })
        .then(function(data) {
            if (!data) {
                res.json({
                    status: 'fail',
                    message: 'state should be confirm'
                });
                return;
            }
            res.json({
                status: 'success'
            });
        })
        .fail(function(err) {
            console.log(err);
            res.json({
                status: 'fail',
                message: 'sql error'
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

router.post('/:id/upload', fileMulter, function(req, res) {
    var file = req.files.file;
    res.json({
        status: 'success',
        data: file.path
    });
});

router.post('/geo', function(req, res, next) {
    var longitude = req.body.longitude,
        latitude = req.body.latitude,
        order_id = req.body.orderId,
        created_time = req.body.createdTime;

    console.log(longitude);
    positionService
        .insert({
            longitude: longitude,
            latitude: latitude,
            order_id: order_id,
            created_time: created_time
        })
        .then(function() {
            res.json({
                status: 'success'
            });
        })
        .fail(function(err) {
            return next(err);
        })
        .catch(function(err) {
            return next(err);
        });
});

router.get('/:id/geo', function(req, res, next) {
    var id = req.params.id;
    positionService
        .findAll(id)
        .then(function(data) {
            res.json({
                status: 'success',
                data: data
            });
        })
        .fail(function(err) {
            return next(err);
        })
        .catch(function(err) {
            return next(err);
        });
});

router.post('/:id/reviews', function(req, res, next) {
    var orderId = req.params.id,
        desc = req.body.desc,
        level = req.body.level,
        userId = req.user.id;

    reviewService
        .countByOrder(orderId)
        .then(function(data) {
            if (data[0].countNum === 0) {
                var review = {
                    description: desc,
                    order_id: orderId,
                    level: level,
                    consignor: userId
                };
                return reviewService.save(review);
            } else {
                return -1;
            }
        })
        .then(function(data) {
            //insert success data is the return id
            if (data === -1) {
                res.json({
                    status: 'fail',
                    message: 'already review'
                });
            }
            res.json({
                status: 'success'
            });
        })
        .fail(function() {
            res.json({
                status: 'fail',
                message: 'insert into review fail'
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

module.exports = router;
