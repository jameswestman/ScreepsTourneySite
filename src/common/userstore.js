"use strict";

const bcrypt = require('bcrypt');
const _ = require('lodash');

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const nameRegex = /^[a-z][a-z0-9_-]{2,20}$/;
const passRegex = /^.{8,72}$/;

function User(data) {
    this.name = data.name;
    this.email = data.email;
    this._password = data.password;
}

// Returns a promise
User.prototype.checkPassword = function(inputPass) {
    return bcrypt.compare(inputPass, this._password);
};

function Userstore(common, data) {
    this._common = common;
    this._users = data;
    this._byUsername = _.keyBy(data, "name");
    this._byEmail = _.keyBy(data, "email");
}

Userstore.prototype.registerUser = function(formdata) {
    var email = formdata.email;
    var name = formdata.username;
    var password = formdata.password;

    return new Promise((resolve, reject) => {
        // validate input
        if(!emailRegex.test(email)) reject(this._common.consts.AUTH_ERR_INVALID_EMAIL);
        if(!nameRegex.test(name)) reject(this._common.consts.AUTH_ERR_INVALID_USERNAME);
        if(!passRegex.test(password)) reject(this._common.consts.AUTH_ERR_INVALID_PASSWORD);

        // make sure both email and username are unique
        if(this.getUserByName(name)) reject(this._common.consts.AUTH_ERR_USERNAME_TAKEN);
        if(this.getUserByEmail(email)) reject(this._common.consts.AUTH_ERR_EMAIL_IN_USE);

        resolve();
    }).then(() => bcrypt.hash(password, 13))
    .then(passhash => {
        // add the user to the database
        var id;
        do {
            id = Math.floor(Math.random() * 1000000000);
        } while(this._users[id]);

        var user = {
            email: email,
            name: name,
            password: passhash,
            id: id
        };

        this._users[id] = this._byUsername[name] = this._byEmail[email] = user;
        this.markedDirty = true;
        return this.getUser(id);
    });
};
Userstore.prototype.getUser = function(id) {
    if(this._users[id]) return new User(this._users[id]);
};
Userstore.prototype.getUserByName = function(name) {
    if(this._byUsername[name]) return new User(this._byUsername[name]);
};
Userstore.prototype.getUserByEmail = function(email) {
    if(this._byEmail[email]) return new User(this._byEmail[email]);
};

module.exports = Userstore;
