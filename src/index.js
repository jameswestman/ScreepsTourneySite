"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const vhost = require('vhost');
const fs = require('fs-promise');
const helmet = require('helmet');

module.exports = function(config, competition) {
    var app = express();

    // send a few headers to help with security
    app.use(helmet());
    if(config.https) {
        if(config.https.hpkp) {
            app.use(helmet.hpkp(config.https.hpkp));
        }
    }

    // router for the static part of the site
    var staticRouter = new express.Router();
    staticRouter.use(express.static(path.join("public_html", "content")));
    staticRouter.use(express.static(path.join("node_modules", "material-components-web", "dist")));

    staticRouter.get("/", (req, res) => {
        // send correct homepage
        if(competition) {
            var now = new Date().getTime();
            if(now < competition.submission) {
                // don't display the page yet if the submission period hasn't started
                res.sendFile(path.join(__dirname, "..", "public_html", "homepages", "normal.htm"));
            } else {
                // send the competition homepage. it contains the countdown info already and will activate it automatically at the correct time
                res.sendFile(path.join(__dirname, "..", "public_html", "content", "competitions", competition.name, "index.htm"));
            }
        } else {
            // send normal homepage
            res.sendFile(path.join(__dirname, "..", "public_html", "homepages", "normal.htm"));
        }
    });
    staticRouter.use((err, req, res, next) => {
        res.status(500).sendFile(path.join(__dirname, "..", "public_html", "errors", "500.htm"));
    });
    staticRouter.use((req, res, next) => {
        res.status(404).sendFile(path.join(__dirname, "..", "public_html", "errors", "404.htm"));
    });

    app.use(vhost(`www.${ config.host }`, staticRouter));

    app.use(vhost(`api.${ config.host }`, require("./api/api.js")));
    app.use(vhost(`viewer.${ config.host }`, require("./viewer/viewer.js")));
    app.use(vhost(`internalapi.${ config.host }`, require("./internalapi/internalapi.js")));
    app.use(vhost(config.consolehost, require("./console/console.js")));

    return app;
}
