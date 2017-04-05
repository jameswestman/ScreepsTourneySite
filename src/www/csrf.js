"use strict";

const crypto = require('crypto');

module.exports.token = function(request) {
    return new Promise(function(resolve, reject) {
        crypto.randomBytes(9, (err, buffer) => {
            if(err) {
                reject(err);
            } else {
                var token = buffer.toString("hex");
                request.session.csrftoken = token;
                resolve(token);
            }
        });
    });
}

module.exports.check = function(request) {
    return request.body.csrftoken === request.session.csrftoken;
}
