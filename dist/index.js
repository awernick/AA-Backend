"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api");
var hook_1 = require("./hook");
var bodyparser = require("body-parser");
var port = process.env.PORT || 3000;
var app = express();
var api = new api_1.Api();
var hook = new hook_1.GoogleAssistantHook();
var config = {
    apiKey: "<API_KEY>",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
};
app.use(bodyparser.json());
app.use(function (req, res) {
});
app.use('/', api.router);
app.use('/hook', hook.router);
app.listen(port, function () { return console.log("AA Backend started on port " + port); });
