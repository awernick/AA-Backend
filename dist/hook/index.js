"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var DialogflowApp = require('actions-on-google').DialogflowApp;
var flightNumberArg = 'flight-number';
var givenNameArg = 'given-name';
var GoogleAssistantHook = /** @class */ (function () {
    function GoogleAssistantHook() {
        this.router = express_1.Router();
        this.setup();
    }
    GoogleAssistantHook.prototype.setup = function () {
        this.router.post('/', this.hook.bind(this));
    };
    GoogleAssistantHook.prototype.hook = function (req, res) {
        var app = new DialogflowApp({ request: req, response: res });
        var intent = app.getIntent();
        res.locals.app = app;
        switch (intent) {
            case 'createFlightTag':
                return this.createFlightTag(req, res);
            case 'findFlightTag':
                return this.findFlightTag(req, res);
            case 'flightArrival':
                return this.flightArrival(req, res);
            case 'flightDeparture':
                return this.flightDeparture(req, res);
            case 'flightInformation':
                return this.flightInformation(req, res);
            default:
                return app
                    .tell("Sorry, I couldn't find what you were trying to do");
        }
    };
    GoogleAssistantHook.prototype.createFlightTag = function (req, res) {
        var app = res.locals.app;
        var db = res.locals.db;
        var user = res.locals.user;
        var flightNumber = app.getArgument(flightNumberArg);
        var tag = app.getArgument(givenNameArg);
        if (!tag || !flightNumber) {
            return app.tell("Sorry, I couldn't tag your flight. Please try again");
        }
        else {
            db.ref('users/' + user.uid + '/tags/' + tag)
                .set({
                flightNumber: flightNumber
            });
            return app.tell("Ready! You can now track " + tag + "'s flight!");
        }
    };
    GoogleAssistantHook.prototype.findFlightTag = function (req, res) {
        var app = res.locals.app;
        var db = res.locals.db;
        var user = res.locals.user;
        var tag = app.getArgument(givenNameArg);
        var departAirport;
        var departTime;
        var arrivalDate;
        var arrivalAirport;
        if (!tag) {
            return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
        }
        else {
            db.ref('users/' + user.uid + '/tags/' + tag)
                .once('value', function (record) {
                if (record.val() == null) {
                    return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
                }
                var flightNumber = record.val().flightNumber;
                return app
                    .tell("Found it! " + tag + "'s flight will leave from " + departAirport + " at " + departTime + " and arrive on " + arrivalDate + " at the " + arrivalAirport + ".");
            });
        }
    };
    GoogleAssistantHook.prototype.flightArrival = function (req, res) {
        var app = res.locals.app;
        var db = res.locals.db;
        var flightNumber = app.getArgument(flightNumberArg);
        if (flightNumber == null) {
            return app
                .tell('The flight ${flightNumber} will arrive at ${Date} to ${Airport}');
        }
        else {
            return app
                .tell('You will arrive at ${airport} by ${Date}.');
        }
    };
    GoogleAssistantHook.prototype.flightDeparture = function (req, res) {
        var app = res.locals.app;
        var db = res.locals.db;
        var flightNumber = app.getArgument(flightNumberArg);
        if (flightNumber == null) {
            return app
                .tell('The flight ${flightNumber} leaves at ${Date} from ${Airport}');
        }
        else {
            return app
                .tell('Your next flight to ${Airport} leaves at ${Date}.');
        }
    };
    GoogleAssistantHook.prototype.flightInformation = function (req, res) {
        var app = res.locals.app;
        var db = res.locals.db;
        var flightNumber = app.getArgument(flightNumberArg);
        if (flightNumber == null) {
            return app
                .tell('The flight ${flightNumber} will leave from ${departAirport} at ${departTime} and arrive on ${arrivalDate} at the ${arrivalAirport}.');
            // GET FLIGHT NUMBER 
        }
        else {
            return app
                .tell('Found it! ${tag}\'s flight will leave from ${departAirport} at ${departTime} and arrive on ${arrivalDate} at the ${arrivalAirport}.');
            // GET USER'S NEXT FLIGHT
        }
    };
    return GoogleAssistantHook;
}());
exports.GoogleAssistantHook = GoogleAssistantHook;
