#!/usr/bin/env node

"use strict";

const fs = require('fs-promise');
const sass = require('node-sass');
const path = require('path');
const nodeminify = require('node-minify');

sass.render({
  file: path.join(__dirname, "..", "resources", "sass", "styles.sass"),
  includePaths: [ path.join(__dirname, "..", "node_modules") ],
  outFile: path.join(__dirname, "..", "public_html", "styles.css")
}, (err, result) => {
    if(err) {
        console.log(err);
    } else {
        fs.writeFile(path.join(__dirname, "..", "public_html", "styles.css"), result.css)
        .then(() => {
            return nodeminify.minify({
                compressor: "clean-css",
                input: path.join(__dirname, "..", "public_html", "styles.css"),
                output: path.join(__dirname, "..", "public_html", "styles.css")
            })
        }).then(e => console.log("Finished compiling SASS"));
    }
});
