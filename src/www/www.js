"use strict";

const express = require('express');
const path = require('path');
const AuthModule = require("./auth.js");
const session = require('express-session');
const bcrypt = require('bcrypt');
const template = require("./template.js");
const csrf = require('./csrf.js');
const send = require('send');

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

    app.use(express.static(path.join("public_html", "static"), { index: "index.htm"}));
    app.use(express.static(path.join("node_modules", "material-components-web", "dist")));

    app.get("/", (req, res) => {
        // send correct homepage
        if(common.competition) {
            if(competition.isSubmissionTime()) {
                // send the competition homepage. it contains the countdown info already and will activate it automatically at the correct time
                template(req, path.join("competitions", competition.name, "index.htm")).then(file => res.type("text/html").send(file));
            } else {
                // don't display the page yet if the submission period hasn't started
                template(req, "homepage.htm").then(file => res.type("text/html").send(file));
            }
        } else {
            // send normal homepage
            template(req, "homepage.htm").then(file => res.type("text/html").send(file));
        }
    });

    // Auth/signin paths
    app.post("/signup-process", (req, res) => {
        auth.signup(req, res)
    });
    app.post("/login-process", (req, res) => {
        auth.login(req, res)
    });
    app.get("/signup", (req, res) => {
        template(req, "signup.htm").then(file => res.type("text/html").send(file));
    });
    app.get("/login", (req, res) => {
        template(req, "login.htm").then(file => res.type("text/html").send(file));
    });

    app.get("/code-submit", (req, res) => {
        if(!req.session.user) {
            res.redirect("/login")
        } else {
            if(common.challenge && common.challenge.isSubmissionTime()) {
                csrf.token(req)
                .then(token =>
                    template(req, "submitcode.htm", {
                        "<!--place-csrf-token-here-->": token,
                        "<!--place-challenge-rules-here-->": JSON.stringify(common.challenge.rules)
                    })
                ).then(file =>
                    res.type("text/html").send(file)
                );
            } else {
                res.status(404).sendFile(path.join(__dirname, "..", "..", "public_html", "errors", "404.htm"));
            }
        }
    });

    app.get("/challenges", (req, res) => {
        template(req, path.join("challenges", "index.htm")).then(file => res.type("text/html").send(file));
    });
    app.get("/challenges/:challenge", (req, res) => {
        template(req, path.join("challenges", req.params.challenge, "index.htm")).then(file => res.type("text/html").send(file));
    });
    app.get("/challenges/:challenge/rules", (req, res) => {
        template(req, path.join("challenges", req.params.challenge, "rules.htm")).then(res.type("text/html").send(file));
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
