"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api");
var port = process.env.PORT || 3000;
var app = express();
var api = new api_1.Api();
app.use('/', api.router);
app.listen(port, function () { return console.log("AA Backend started on port " + port); });