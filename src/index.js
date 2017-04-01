"use strict";

const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static("public_html"));
    app.use(express.static(path.join("node_modules", "material-components-web", "dist")));

    app.listen(8080);
}
