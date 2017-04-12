"use strict";

const express = require('express');
const path = require('path');
const AuthModule = require("./auth.js");
const session = require('express-session');
const bcrypt = require('bcrypt');
const template = require("./template.js");
const csrf = require('./csrf.js');
const send = require('send');
const multer = require('multer');

module.exports = function(common) {
    var app = new express.Router();
    var auth = new AuthModule(common);

    var storage = multer.memoryStorage();
    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 100000,
            files: 100
        },
        fileFilter: (req, file, cb) => {
            if(!file.originalname.endsWith(".js")) cb(null, false);
            cb(null, true);
        }
    });

    var cookieSecret = bcrypt.genSaltSync();

    app.use(express.static(path.join("public_html", "static"), { index: "index.htm"}));
    app.use(express.static(path.join("node_modules", "material-components-web", "dist")));

    app.use(session({
        secret: cookieSecret,
        secure: common.config.https ? true : false,
        saveUninitialized: false,
        resave: false,
    }));

    app.use((req, res, next) => {
        if(req.session.userid) {
            req.sessionuser = common.db.users.getUser(req.session.userid);
        }
        next();
    });

    app.get("/", (req, res) => {
        // send correct homepage
        if(common.challenge) {
            if(common.challenge.isSubmissionTime()) {
                // send the competition homepage. it contains the countdown info already and will activate it automatically at the correct time
                template(req, path.join("challenges", common.challenge.name, "index.htm")).then(file => res.type("text/html").send(file));
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
    app.get("/logout", (req, res) => {
        auth.logout(req, res)
    });
    app.get("/signup", (req, res) => {
        template(req, "signup.htm").then(file => res.type("text/html").send(file));
    });
    app.get("/login", (req, res) => {
        template(req, "login.htm").then(file => res.type("text/html").send(file));
    });

    app.get("/code-submit", (req, res) => {
        if(!req.sessionuser) {
            res.redirect("/login")
        } else {
            if(common.challenge && common.challenge.isSubmissionTime()) {
                csrf.token(req)
                .then(token =>
                    template(req, "submitcode.htm", {
                        "<!--place-csrf-token-here-->": token,
                        "<!--place-challenge-rules-here-->": JSON.stringify(common.challenge.rules),
                        "<!--place-challenge-name-here-->": common.challenge.name
                    })
                ).then(file =>
                    res.type("text/html").send(file)
                );
            } else {
                res.status(404).sendFile(path.join(__dirname, "..", "..", "public_html", "errors", "404.htm"));
            }
        }
    });
    app.post("/code-submit-process", upload.array("code", 100), (req, res) => {
        if(!req.sessionuser) {
            res.redirect("/login");
        }
        if(!common.challenge || !common.challenge.isSubmissionTime()) {
            res.redirect("/");
        }

        // create JSON array of file contents
        var code = {};
        for(let file of req.files) {
            code[file.originalname.replace(/\.js$/, "")] = file.buffer.toString("utf8");
        }

        // now get the rest of the fields
        var challenge = common.challenge;
        var settings = {};
        if(challenge.rules.allowChooseMineral) {
            settings.mineral = req.body.mineral || "H";
        }
        if(!challenge.rules.disallowChooseSpawn) {
            settings.spawn = {
                x: req.body["spawn-x"],
                y: req.body["spawn-y"]
            }
        }

        var entry = {
            code: code,
            settings: settings,
            username: req.sessionuser.name
        }

        req.sessionuser.enter(entry)
        .then(() => {
            res.redirect("/submission-complete");
        }).catch(err => {
            res.status(500).sendFile(path.join(__dirname, "..", "..", "public_html", "errors", "500.htm"));
            console.log(err);
        });
    });
    app.get("/submission-complete", (req, res) => {
        template(req, "submissioncomplete.htm").then(file => res.type("text/html").send(file));
    });

    app.get("/challenges", (req, res) => {
        template(req, path.join("challenges", "index.htm")).then(file => res.type("text/html").send(file));
    });
    app.get("/challenges/:challenge", (req, res) => {
        if(req.params.challenge === "..") {
            // malicious url
            res.status(403).send("forbidden");
            console.log("malicious URL!")
        }
        template(req, path.join("challenges", req.params.challenge, "index.htm")).then(file => res.type("text/html").send(file));
    });
    app.get("/challenges/:challenge/rules", (req, res) => {
        template(req, path.join("challenges", req.params.challenge, "rules.htm")).then(file => res.type("text/html").send(file));
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
