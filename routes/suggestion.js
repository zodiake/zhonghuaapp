var express = require('express');
var router = express.Router();
var service = require('../service/suggestService');
var e_jwt = require('express-jwt');
var config = require('../config');

var router = express.Router();

router.use(e_jwt({
    secret: config.key
}));

var verify = function(req, res, next) {
    if (req.user.authority != 'ROLE_ADMIN') {
        var err = new Error();
        err.name = 'UnauthorizedError';
        return next(err);
    }
    next();
}

router.get('/', verify, function(req, res, next) {
    var state = req.query.state || 'all',
        page = req.query.page || 1,
        size = req.query.size || 15;
    service
        .findByState(state, {
            page: page - 1,
            size: size
        })
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            return next(err);
        });
});

router.post('/', function(req, res, next) {
    var desc = req.body.desc,
        usr = req.user;
    service
        .save({
            description: desc,
            created_time: new Date(),
            user_name: usr.name,
            state: 0
        })
        .then(function(data) {
            res.json({
                status: 'success'
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

router.get('/:id', verify, function(req, res, next) {
    var id = req.params.id;

    service
        .findOne(id)
        .then(function(data) {
            if (data[0].state == 1) {
                res.json({
                    status: 'success',
                    data: data[0]
                })
            } else {
                return service
                    .updateState(data[0].id)
                    .then(function(d) {
                        data[0].state = 1;
                        res.json({
                            status: 'success',
                            data: data[0]
                        });
                    })
            }
        })
        .catch(function(err) {
            return next(err);
        })
});

module.exports = router;
