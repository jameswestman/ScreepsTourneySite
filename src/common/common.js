"use strict";

const EventEmitter = require('events');
const Database = require("./db.js");
const fs = require('fs-promise');
const path = require('path');

function Challenge(name, dir) {
    this._data = JSON.parse(fs.readFileSync(path.join(dir, "info.json"), { encoding: "utf8" }));
    this.rules = this._data.rules;
    this.name = name;
}

Challenge.prototype.isSubmissionTime = function() {
    var now = new Date().getTime() / 1000;
    return now > this._data.times.submission && now < this._data.times.processing;
};

// this function contains blocking file io
function Common(config) {
    // The config file
    this.config = config;

    // used to send notifications between the internal API and the live viewer API
    this.notificationEmitter = new EventEmitter();

    this.db = new Database(this, config.paths.data);

    var challenges = JSON.parse(fs.readFileSync(path.join(config.paths.challenges, "index.json")));
    if(challenges[0]) {
        this.challenge = new Challenge(challenges[0], path.join(config.paths.challenges, challenges[0]));
    }
}

Object.defineProperty(Common.prototype, "consts", {
    value: {
        AUTH_ERR_INVALID_EMAIL: "auth_error_invalid_email",
        AUTH_ERR_INVALID_USERNAME: "auth_error_invalid_username",
        AUTH_ERR_INVALID_PASSWORD: "auth_error_invalid_password",
        AUTH_ERR_USERNAME_TAKEN: "auth_error_username_taken",
        AUTH_ERR_EMAIL_IN_USE: "auth_error_email_in_use",
        AUTH_ERR_INVALID_CREDENTIALS: "auth_error_invalid_credentials"
    }
});

module.exports = Common;
