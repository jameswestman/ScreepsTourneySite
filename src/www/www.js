"use strict";

const express = require('express');
const path = require('path');
const AuthModule = require("./auth.js");
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

module.exports = function(common) {
    var app = new express.Router();
    var auth = new AuthModule(common);

    var cookieSecret = bcrypt.genSaltSync();

    app.use(session({
        secret: cookieSecret,
        secure: common.config.https ? true : false,
        saveUninitialized: false,
        resave: false
    }));
    app.use(cookieParser(cookieSecret));

    app.use(express.static(path.join("public_html", "content"), { index: "index.htm"}));
    app.use(express.static(path.join("node_modules", "material-components-web", "dist")));

    app.get("/", (req, res) => {
        // send correct homepage
        if(common.competition) {
            var now = new Date().getTime();
            if(now < competition.submission) {
                // don't display the page yet if the submission period hasn't started
                res.sendFile(path.join(__dirname, "..", "..", "public_html", "homepages", "normal.htm"));
            } else {
                // send the competition homepage. it contains the countdown info already and will activate it automatically at the correct time
                res.sendFile(path.join(__dirname, "..", "..", "public_html", "content", "competitions", competition.name, "index.htm"));
            }
        } else {
            // send normal homepage
            res.sendFile(path.join(__dirname, "..", "..", "public_html", "homepages", "normal.htm"));
        }
    });

    app.post("/signup-process", (req, res) => {
        auth.signup(req, res)
    });
    app.post("/login-process", (req, res) => {
        auth.login(req, res)
    });

    app.use((err, req, res, next) => {
        res.status(500).sendFile(path.join(__dirname, "..", "..", "public_html", "errors", "500.htm"));
        console.log(err, err.stack);
    });
    app.use((req, res, next) => {
        res.status(404).sendFile(path.join(__dirname, "..", "..", "public_html", "errors", "404.htm"));
    });

    return app;
}
