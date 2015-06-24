var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json([{
        id: 1,
        state: 'a',
        vehicle: 2
    }, {
        id: 2,
        state: 'b',
        vehicle: 2
    }, {
        id: 3,
        state: 'c',
        vehicle: 2
    }, {
        id: 4,
        state: 'd',
        vehicle: 2
    }, {
        id: 5,
        state: 'a',
        vehicle: 2
    }, {
        id: 6,
        state: 'b',
        vehicle: 2
    }]);
});

module.exports = router;
