"use strict";

const EventEmitter = require('events');
const Database = require("./db.js");

function Common(config) {
    // The config file
    this._config = config;

    // used to send notifications between the internal API and the live viewer API
    this.notificationEmitter = new EventEmitter();

    this.db = new Database(config.paths.data);
}

module.exports = Common;
