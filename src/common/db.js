"use strict";

const fs = require('fs-promise');
const path = require('path');

const Userstore = require("./userstore.js");

// Please note that the constructor must load some files, and does so synchronously.
function Database(dbpath) {
    var usersPath = path.join(dbpath, "users.json");
    if(!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, JSON.stringify({}));
    }
    this.users = new Userstore(JSON.parse(fs.readFileSync(usersPath)));
}

module.exports = Database;
