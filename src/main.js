#!/usr/bin/env node

"use strict";

const fs = require('fs-promise');
const path = require('path');
const markdownit = require('markdown-it');
const yargs = require('yargs');

var args = yargs();

var config;

// load config file
fs.readFile("config.json", { encoding: "utf8"})
.then(file => {
    return config = JSON.parse(file);
}).then(config => require("./index.js")(config)
).then(app => {
    if(config.https) {
        const https = require("https");

        var key, cert;
        fs.readFile(config.https.key)
        .then(k => {
            key = k;
            return fs.readFile(config.https.cert);
        }).then(c => {
            cert = c;

            https.createServer({ key: key, cert: cert }, app).listen(config.port || 8080);
            console.log("Listening (secure) on port " + (config.port || 8080));
        })
    } else {
        app.listen(config.port || 8080);
        console.log("Listening (NOT SECURE) on port " + (config.port || 8080));
    }
}).catch(err => {
    console.log(err);
});
