"use strict"

const express = require('express')

module.exports = function(common) {
    var app = new express.Router()

    common.clientEV.on("event", ev => console.log(ev))

    return app
};
