"use strict";

const fs = require('fs-promise');

function template(path, subs) {
    return fs.readFile(path, { encoding: "utf8" })
    .then(file => {
        for(let sub in subs) {
            file = file.replace(sub, subs[sub]);
        }
        return file;
    });
}

module.exports = template;
