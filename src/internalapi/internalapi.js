"use strict";

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const done = JSON.stringify({done: true});

module.exports = function(common) {
    var app = new express.Router();

    app.use((req, res, next) => {
        if(req.header("Authorization")) {
            var encoded = req.header("Authorization").split(":")[1];
            var decoded = new Buffer(encoded, "base64").toString("utf8");

            bcrypt.compare(decoded, common.config.apiPassword)
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

    app.put("/status", (req, res) => {
        common.updateProcessorStatus(req.body.status, req.body.progress);
        res.send(done);
    });
    app.put("/tickrate", (req, res) => {
        common.updateTickrate(req.body.tickrate);
        res.send(done);
    });

    app.post("/room-history", (req, res) => {
        common.challenge.postRoomHistory(req.body);
        res.send(done);
    });

    app.post("/notification", (req, res) => {
        common.challenge.addNotification(req.body.time, req.body.eventData);
        res.send(done);
    });

    return app;
}
