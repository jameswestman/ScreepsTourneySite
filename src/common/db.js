"use strict";

const fs = require('fs-promise');
const path = require('path');

const Userstore = require("./userstore.js");

// Please note that the constructor must load some files, and does so synchronously.
function Database(common, dbpath) {
    var usersPath = path.join(dbpath, "users.json");
    if(!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, JSON.stringify({}));
    }
    this._userdata = JSON.parse(fs.readFileSync(usersPath));
    this.users = new Userstore(common, this._userdata);

    setInterval(() => {
        if(this.users.markedDirty) {
            fs.writeFile(usersPath, JSON.stringify(this._userdata))
            .then(() => {
                console.log("Flushed changes to userstore file")
                this.users.markedDirty = false;
            })
            .catch(err => console.log(err));
        }
    }, 60000);
}

module.exports = Database;
