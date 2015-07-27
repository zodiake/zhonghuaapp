/*jslint node: true */
'use strict';
var csv = require('csv');
var _ = require('lodash');

var fs = require('fs');
var join = require('path').join;

var userService = require('../service/userService');
var categoryService = require('../service/categoryService');


function importBegin(nsp, filePath, room) {

    function socketEmitFail(data, message) {
        data.message = message;
        nsp.to(room).emit('fail', data);
        data.error = true;
        return data;
    }

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
                return socketEmitFail(data, 'no valid data type');
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
                        if (data) {
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

        if (data && !data.error) {
            userService
                .findByName(data.mobile)
                .then(convertConsignee)
                .then(convertCategory)
                .then(convertCargooName)
                .then(function (data) {
                    if (total && data.row == total) {}
                })
                .fail(function (err) {
                    console.log('fail', err);
                    data.message = err.message;
                })
                .catch(function (err) {
                    console.log('err', err);
                    data.message = err.message;
                });
        }
    });

    var testPath = join(__dirname, '..', filePath);
    fs.createReadStream(testPath).pipe(parser).pipe(extract).pipe(validate).pipe(findConsignee);
}

module.exports = importBegin;
