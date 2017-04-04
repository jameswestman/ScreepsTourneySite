"use strict";

const EventEmitter = require('events');
const Database = require("./db.js");

function Common(config) {
    // The config file
    this.config = config;

    // used to send notifications between the internal API and the live viewer API
    this.notificationEmitter = new EventEmitter();

    this.db = new Database(this, config.paths.data);
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
