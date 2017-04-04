"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const vhost = require('vhost');
const fs = require('fs-promise');
const helmet = require('helmet');

const Common = require("./common/common.js");

module.exports = function(config, competition) {
    // create common object
    var common = new Common(config);

    var app = express();

    // send a few headers to help with security
    app.use(helmet());
    if(config.https) {
        if(config.https.hpkp) {
            app.use(helmet.hpkp(config.https.hpkp));
        }
    }

    app.use(bodyParser.urlencoded({
        extended: false
    }))

    app.use(vhost(`www.${ config.host }`, require("./www/www.js")(common)));
    app.use(vhost(`api.${ config.host }`, require("./api/api.js")(common)));
    app.use(vhost(`viewer.${ config.host }`, require("./viewer/viewer.js")(common)));
    app.use(vhost(`internalapi.${ config.host }`, require("./internalapi/internalapi.js")(common)));
    app.use(vhost(config.consolehost, require("./console/console.js")(common)));

    return app;
}
