"use strict"

const path = require('path');

module.exports = {
    entry: path.join(__dirname, "viewer.js"),
    output: {
        path: path.join(__dirname, "..", "..", "public_html", "viewer"),
        filename: "viewer.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            }
        ]
    }
};
