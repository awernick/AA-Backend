"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DialogflowApp = require('actions-on-google').DialogflowApp;
var GoogleAssistantHook = /** @class */ (function () {
    function GoogleAssistantHook() {
        this.router = express_1.Router();
        this.setup();
    }
    GoogleAssistantHook.prototype.setup = function () {
        this.router.get('/', function (req, res) {
            var app = new DialogflowApp({ request: req, response: res });
            var intent = app.getIntent();
            switch (intent) {
                case 'createFligthTag':
                    return this.createFlightTag(app);
                case 'findFlightTag':
                    return this.findFlightTag(app);
                case 'flightArrival':
                    return this.flightArrival(app);
                case 'flightDeparture':
                    return this.flightDeparture(app);
                case 'flightInformation':
                    return this.flightInformation(app);
                default:
                    return app
                        .tell("Sorry, I couldn't find what you were trying to do");
            }
        });
    };
    GoogleAssistantHook.prototype.createFlightTag = function (app) {
    };
    GoogleAssistantHook.prototype.findFlightTag = function (app) {
    };
    GoogleAssistantHook.prototype.flightArrival = function (app) {
    };
    GoogleAssistantHook.prototype.flightDeparture = function (app) {
    };
    GoogleAssistantHook.prototype.flightInformation = function (app) {
    };
    return GoogleAssistantHook;
}());
exports.GoogleAssistantHook = GoogleAssistantHook;
