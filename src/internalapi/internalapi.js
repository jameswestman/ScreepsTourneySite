"use strict";

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

module.exports = function(common) {
    var app = new express.Router();

    app.use((req, res, next) => {
        if(req.header("Authorization")) {
            bcrypt.compare(req.header("Authorization"), common.config.apiPassword)
            .then(valid => {
                if(valid) {
                    next();
                } else {
                    res.status(401).send("401 unauthorized");
                }
            });
        } else {
            res.status(401).send("401 unauthorized");
        }
    });

    app.use(bodyParser.json({
        inflate: true
    }))

    app.use((req, res, next) => {
        if(!common.challenge) {
            res.status(503).send("404 file not available");
        }
        next();
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
        res.send("done");
    });
    app.put("/tickrate", (req, res) => {
        common.updateTickrate(req.body.tickrate);
        res.send("done");
    });

    app.post("/room-history", (req, res) => {
        common.challenge.postRoomHistory(req.body);
        res.send("done");
    });

    app.post("/notification", (req, res) => {
        common.challenge.addNotification(req.body.time, req.body.eventData);
        res.send("done");
    });

    return app;
}
