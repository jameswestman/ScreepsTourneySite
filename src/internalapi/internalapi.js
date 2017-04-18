"use strict";

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const done = JSON.stringify({done: true});

module.exports = function InternalAPI(common) {
    this._processor = undefined

    var app = new express.Router();

    app.use((req, res, next) => {
        if(req.header("Authorization")) {
            var auth = req.header("Authorization").split(" ")[1]
            var pass = Buffer.from(auth, "base64").toString("utf8").split(":")[1]

            bcrypt.compare(pass, common.config.apiPassword)
            .then(valid => {
                if(valid) {
                    next();
                } else {
                    res.status(401).send(JSON.stringify({ err: "401 unauthorized" }));
                }
            });
        } else {
            res.status(401).send(JSON.stringify({ err: "401 unauthorized" }));
        }
    });

    app.use(bodyParser.json({
        inflate: true
    }))

    app.put("/status", (req, res) => {
        if(!this._processor) this._processor = new (require("./processor"))(common)
        this._processor.setStatus(req.body.status, parseInt(req.body.progress))

        if(req.body.status.startsWith("~START")) {
            this._processor.setStartTime(parseInt(req.body.time))
            this._processor.start()
        } else if(req.body.status.startsWith("~FINISH")) {
            this._processor.stop()
            delete this._processor
        }

        res.send(done);
    })

    app.use((req, res, next) => {
        if(!common.challenge) {
            res.status(404).send(JSON.stringify({err: "404 file unavailable"}));
        } else {
            next();
        }
    });

    app.get("/challenge", (req, res) => {
        res.send(common.challenge.getInfo());
    });
    app.get("/submission-list", (req, res) => {
        common.challenge.getSubmissionList()
        .then(list => res.send(JSON.stringify(list)));
    });
    app.get("/submission/:id", (req, res) => {
        common.challenge.getSubmissionRaw(req.params.id)
        .then(submission => res.send(submission));
    });
    app.put("/tickrate", (req, res) => {
        common.updateTickrate(req.body.tickrate);
        res.send(done);
    });

    app.post("/room-history", (req, res) => {
        if(!this._processor) {
            res.status(404).send(JSON.stringify({err: "404 file unavailable"}))
        } else {
            this._processor.addHistory(req.body)
            res.send(done)
        }
    });

    app.post("/notification", (req, res) => {
        common.challenge.addNotification(req.body.time, req.body.eventData);
        res.send(done);
    });

    return app;
}
