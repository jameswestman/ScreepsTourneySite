"use strict";

const bcrypt = require('bcrypt');
const _ = require('lodash');

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const nameRegex = /^[a-z][a-z0-9_-]{2,20}$/;
const passRegex = /^.{8-72}$/;

function User(id) {
    this._data = userstore.users[id];
}

// Returns a promise
User.prototype.checkPassword = function(inputPass) {
    return bcrypt.compare(inputPass, this._data.pass);
};
Object.defineProperty(User.prototype, "name", {
    get: () => this._data.name
});
Object.defineProperty(User.prototype, "email", {
    get: () => this._data.email
});

function Userstore(data) {
    this._users = data;
    this._byUsername = _.keyBy(data.users, user => user.name);
    this._byEmail = _.keyBy(data.users, user => user.email);
}

Userstore.prototype.registerUser = function () {
    var email = formdata.email;
    var name = formdata.name;
    var password = formdata.password;

    // validate input
    if(!emailRegex.test(email)) throw "Please enter a valid email address";
    if(!nameRegex.test(name)) throw "Please enter a valid username";
    if(!passRegex.test(password)) throw "Please enter a password that is 8 to 72 characters";

    // make sure both email and username are unique
    if(this.getUserByName(name)) throw "Sorry, that username is taken";
    if(this.getUserByEmail(email)) throw "Someone has already created an account with that email address";

    // hash password, then continue
    bcrypt.hash(password, 13)
    .then(passhash => {
        // add the user to the database
        var id;
        do {
            id = Math.floor(Math.random() * 1000000000);
        } while(this._users[id]);

        var user = {
            "e": email,
            "n": name,
            "p": passhash
        };

        this._users[id] = this._byUsername[name] = this._byEmail[email] = user;
    });
};
Userstore.prototype.getUser = function() {
    return new User(id);
};
Userstore.prototype.getUserByName = function(name) {
    return byUsername[name];
};
Userstore.prototype.getUserByEmail = function(email) {
    return byEmail[email];
};

module.exports = Userstore;
