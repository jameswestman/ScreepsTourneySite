"use strict";

const EventEmitter = require('events');
const Database = require("./db.js");
const fs = require('fs-promise');
const path = require('path');
const _ = require("lodash");

function Challenge(common, name, dir) {
    this._common = common;
    this._data = JSON.parse(fs.readFileSync(path.join(dir, "info.json"), { encoding: "utf8" }));
    this._history = {};
    this._notifications = {};
    this.rules = this._data.rules;
    this.name = name;

    this.mkdir();
}

Challenge.prototype.isSubmissionTime = function() {
    var now = new Date().getTime() / 1000;
    return now > this._data.times.submission && now < this._data.times.processing;
};
// Get the info document for the challenge. Returns string, not JSON.
Challenge.prototype.getInfo = function() {
    return JSON.stringify(this._data);
};
Challenge.prototype.writeEvent = function(time, room, event, data) {
    fs.appendFile(path.join(this.getPath(), "events.log"), `${ time } ${ room } ${ event } ${ JSON.stringify(data) }\n`)
};

/*
 * Create the directory structure for the challenge.
 */
Challenge.prototype.mkdir = function() {
    return fs.mkdir(path.join(this._common.config.paths.data, "challenges"))
    .catch(err => {
        if(err.code !== "EEXIST") throw err;
    }).then(() => fs.mkdir(this.getPath()) )
    .catch(err => {
        if(err.code !== "EEXIST") throw err;
    }).then(() => fs.mkdir(this.getPath("entries")) )
    .catch(err => {
        if(err.code !== "EEXIST") throw err;
    }).then(() => fs.mkdir(this.getPath("histories")) )
    .catch(err => {
        if(err.code !== "EEXIST") throw err;
    })
};
/*
 * Gets the path to the directory where data about this challenge is stored.
 * Does not ensure that the directory actually exists. See Challenge.mkdir()
 *
 * If a parameter is specified, it is added to the end. Use this to get the path
 * to a subdirectory more conveniently.
 */
Challenge.prototype.getPath = function(to) {
    if(to) return path.join(this._common.config.paths.data, "challenges", this.name, to);
    else return path.join(this._common.config.paths.data, "challenges", this.name);
};
// Returns a promised array of all user IDs who have entered the challenge
Challenge.prototype.getSubmissionList = function() {
    return fs.readdir(this.getPath("entries"))
    .then(files => _.map(files, file => file.replace(".json", "")));
};
// Returns a JSON string, not an object
Challenge.prototype.getSubmissionRaw = function(userid) {
    return fs.readFile(this.getPath(path.join("entries", userid + ".json")));
};

/*
 * Gets the room histories for the given tick, then removes them from memory.
 * If undefined is returned, there is no data for that tick and the webserver should
 * wait for more data.
 */
Challenge.prototype.consumeRoomHistory = function(tick) {
    var history = this._history[tick];
    delete this._history[tick];
    return history;
}
Challenge.prototype.saveRoomHistory = function(room) {
    // write room history to file
    fs.writeFile(this.getPath(path.join("histories", `${ room.room }-${ room.base }.json`)), JSON.stringify(room));
};
// Returns an array of notifications from the given tick
Challenge.prototype.consumeNotifications = function(tick) {
    var notifications = this._notifications[tick];
    delete this._notifications[tick];
    return notifications;
};
// Adds a notification to the queue, to be retrieved by Challenge.consumeNotifications()
Challenge.prototype.addNotification = function(time, data) {
    if(!this._notifications[time]) this._notifications[time] = [];
    this._notifications[time].push(data);

    console.log("Added notification " + JSON.stringify(data) + " on tick " + time);
};

// this function contains blocking file io
function Common(config) {
    // The config file
    this.config = config;

    // general event emitter
    this.ev = new EventEmitter()
    // used only for messages the client can subscribe to
    this.clientEV = new EventEmitter()

    this.db = new Database(this, config.paths.data);

    var challenges = JSON.parse(fs.readFileSync(path.join(config.paths.challenges, "index.json")));
    if(challenges[0]) {
        this.challenge = new Challenge(this, challenges[0], path.join(config.paths.challenges, challenges[0]));
    }
}

Common.prototype.updateTickrate = function(tickrate) {
    this.tickrate = tickrate;
    this.ev.emit("tickrate", tickrate);
};

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
