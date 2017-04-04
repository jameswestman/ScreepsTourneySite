"use strict";

function AuthModule(common) {
    this._common = common;
}

AuthModule.prototype.signup = function(req, res) {
    this._common.db.users.registerUser(req.body)
    .then(user => {
        req.session.user = user;
        req.session.cookie.username = user.name;
        res.redirect("/");
    }).catch(err => {
        if(err.startsWith && err.startsWith("auth_error_")) {
            res.redirect("/signup?error=" + err);
        } else {
            throw err;
        }
    });
};

AuthModule.prototype.login = function(req, res) {
    var user = this._common.db.users.getUserByEmail(req.body.email);

    if(user) {
        user.checkPassword(req.body.password)
        .then(valid => {
            if(valid) {
                req.session.user = user;
                res.cookie("name", user.name);
                res.redirect("/");
            } else {
                res.redirect("/login?error=" + this._common.consts.AUTH_ERROR_INVALID_CREDENTIALS);
            }
        });
    } else {
        res.redirect("/login?error=" + this._common.consts.AUTH_ERROR_INVALID_CREDENTIALS);
    }
};

module.exports = AuthModule;
