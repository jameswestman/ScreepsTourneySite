"use strict"

const express = require('express')
const path = require('path')

module.exports = function(common) {
    var app = new express.Router()

    app.use(express.static(path.join("public_html", "static")))
    app.use(express.static(path.join("public_html", "viewer"), { index: "index.htm" }))
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "public_html", "viewer", "index.htm"))
    })

    return app
};
