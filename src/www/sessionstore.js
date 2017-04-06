"use strict";

const util = require('util');

// not a very good session store, but it works
module.exports = function(session) {
    var data = {};
    function SessionStore() {
    }

    SessionStore.prototype.all = function(cb) {
        cb(null, Object.values(data));
    };
    SessionStore.prototype.clear = function(cb) {
        data = {};
        cb();
    };
    SessionStore.prototype.get = function(sid, cb) {
        cb(null, data[sid]);
    };
    SessionStore.prototype.destroy = function(sid, cb) {
        delete data[sid];
        cb();
    };
    SessionStore.prototype.length = function(cb) {
        cb(null, Object.keys(data).length);
    };
    SessionStore.prototype.set = function(sid, s, cb) {
        data[sid] = s;
        cb();
    };

    util.inherits(SessionStore, session.Store);

    return SessionStore;
}
