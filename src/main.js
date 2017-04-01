#!/usr//bin/env node

"use strict";

const fs = require('fs-promise');
const path = require('path');
const markdownit = require('markdown-it');

// setup markdown-it and any extensions needed
const markdown = new markdownit();

// launch the server
require("./index.js")();
