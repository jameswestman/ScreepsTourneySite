"use strict";

const fs = require('fs-promise');
const path = require('path');

function template(req, filepath, subs) {
    if(req.sessionuser) {
        subs = subs || {}
        subs["<!--place-username-here-->"] = req.sessionuser.name
        subs["<!--place-logout-link-here-->"] = `
        <a class="mdc-list-item" href="/logout">
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">power_settings_new</i>Log Out
        </a>`
    }

    return fs.readFile(path.join("public_html", "content", filepath), { encoding: "utf8" })
    .then(file => {
        if(subs) {
            for(let sub in subs) {
                file = file.replace(sub, subs[sub]);
            }
        }

        return file;
    });
}

module.exports = template;
