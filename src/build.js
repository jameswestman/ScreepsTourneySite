#!/usr/bin/env node

"use strict";

const fs = require('fs-promise');
const sass = require('node-sass');
const path = require('path');
const nodeminify = require('node-minify');
const markdownit = require('markdown-it');
const os = require('os');

var markdown = new markdownit();

var config = require("../config.json");

// Replace the filename extension for the given file. TODO: Replace edge case
// with files that have no extension
function extension(file, ext) {
    return file.substr(0, file.lastIndexOf(".")) + "." + ext;
}

var template = fs.readFileSync(path.join("resources", "template.htm"), { encoding: "utf8" });

// Wrap the given html in the template.
function wrapTemplate(html) {
    // replace placeholder comment in template with actual content
    var result = template.replace("<!--place-content-here-->", html);

    // the html given should contain a title. if so, put that title in the template
    var titleRegex = /(?:<|\()!--title(.+?)--(?:>|\))/g;
    var title = titleRegex.exec(html);
    if(title) result = result.replace("<!--place-title-here-->", title[1].trim()).replace(titleRegex, "");
    else console.log(`[WARNING] That file does not have a title`);
    return result;
}

function readFile(file, bin) {
    return fs.readFile(file, bin ? {} : { encoding: "utf8" } );
}

/*
 * Renders files from resources into browser-compatible formats. Does not
 * include minification.
 */
function render(file) {
    console.log("Rendering " + file);

    if(file.endsWith(".md")) {
        // render to HTML
        return readFile(file)
        .then(contents => ({ ext: "htm", data:  wrapTemplate(markdown.render(contents)) }));
    } else if(file.endsWith(".sass") || file.endsWith(".scss")) {
        // compile SASS and SCSS files (this project mostly uses SASS, but support SCSS just in case)
        return new Promise((res, rej) => {
            readFile(file)
            .then(contents => {
                sass.render({
                    data: contents,
                    includePaths: [ path.join("node_modules") ],
                    indentedSyntax: file.endsWith(".sass")
                }, (err, result) => {
                    if(err) rej(err);
                    else res({
                        ext: "css",
                        data: result.css
                    });
                });
            });
        });
    } else if(file.endsWith(".htm") || file.endsWith(".html")) {
        return readFile(file)
        .then(contents => ({ ext: "htm", data: wrapTemplate(contents) }));
    } else {
        // read file, then return it without processing. Make sure it is read without text encoding, as this will corrupt images.
        return readFile(file, true)
        .then(contents => ({ ext: file.substr(file.lastIndexOf(".") + 1), data: contents }));
    }
}

function processDir(dir) {
    console.log("Processing directory " + dir);

    var files;

    fs.readdir(path.join("resources", dir))
    .then(fileList => files = fileList)
    .then(() => fs.mkdir(path.join("public_html", dir))
        .catch(e => {
            if(e.code !== "EEXIST") throw e;
        })
    ).then(() => {
        files.forEach(filename => {
            var file = path.join("resources", dir, filename);

            fs.stat(file)
            .then(stats => {
                if(stats.isDirectory()) {
                    processDir(path.join(dir, filename))
                } else {
                    render(file)
                    .then(contents => {
                        fs.writeFile(extension(path.join("public_html", dir, filename), contents.ext), contents.data);
                    });
                }
            });
        });
    }).catch(e => console.log(e));
}

processDir("");

// now process challenges
var challenges = require(path.join(__dirname, "..", config.paths.challenges, "index.json"));
for(let challenge of challenges) {
    console.log("Processing challenge " + challenge)

    // make directory if needed
    fs.mkdir(path.join("public_html", "content", "challenges", challenge))
    .catch(e => {
        if(e.code !== "EEXIST") throw e;
    })
    .then(() => render(path.join(config.paths.challenges, challenge, "index.md"))) // render the index file
    .then(contents => {
        fs.writeFile(path.join("public_html", "content", "challenges", challenge, "index.htm"), contents.data);
    })
    .then(() => render(path.join(config.paths.challenges, challenge, "rules.md"))) // now render the rules file
    .then(contents => {
        fs.writeFile(path.join("public_html", "content", "challenges", challenge, "rules.htm"), contents.data);
    });
}

// create an index file for the challenges, then render it
var challengeIndex =
`(!--title Previous Challenges--)
# Previous Challenges
Here's all the previous challenges and their results:` + os.EOL;
for(let challenge of challenges) {
    challengeIndex += `- [${ challenge }](${ challenge }/)`;
}

fs.writeFile(path.join("public_html", "content", "challenges", "index.htm"), wrapTemplate(markdown.render(challengeIndex)));
