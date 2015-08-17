/*jslint node: true */
'use strict';
var JPush = require('jpush-sdk');
var client = JPush.buildClient('7867df712b8a722667e3df5f', '79481b91afa10953574f9983');

//easy push
module.exports = function (tag, message, cb) {
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.tag(tag))
        .setNotification('Hi, JPush', JPush.ios('ios alert'), JPush.android('android alert', null, 1))
        .setMessage(message)
        .setOptions(null, 60)
        .send(function (err, res) {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message);
                    //Response Timeout means your request to the server may have already received, please check whether or not to push
                    console.log(err.isResponseTimeout);
                } else if (err instanceof JPush.APIRequestError) {
                    console.log(err.message);
                }
                if (cb)
                    cb(err);
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
                if (cb)
                    cb(null);
            }
        });
};
