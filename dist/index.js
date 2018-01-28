"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api");
var hook_1 = require("./hook");
var bodyparser = require("body-parser");
var firebase = require("./helpers/firebase.helper");
var port = process.env.PORT || 3000;
var app = express();
var api = new api_1.Api();
var hook = new hook_1.GoogleAssistantHook();
app.use('/', function (req, res, next) {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyparser.json());
// Database
app.use(function (req, res, next) {
    res.locals.db = firebase.getInstance().database();
    next();
});
// Email
app.use(function (req, res, next) {
    res.locals.user = {
        email: 'alanwernick242@gmail.com',
        uid: '-L3vh6rdAC374-8t13oA'
    };
    next();
});
// Routes
app.use('/', api.router);
app.use('/hook', hook.router);
app.use('/migrate', firebase.migrateUser);
app.listen(port, function () {
    firebase.setup();
    console.log("AA Backend started on port " + port);
});
