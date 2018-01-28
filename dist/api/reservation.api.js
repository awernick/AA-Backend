"use strict";
//
// reservation.api
//
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../config");
var http = require("request");
function show(req, res) {
}
exports.show = show;
function create(req, res) {
    var user = res.locals.user;
    var db = res.locals.db;
    var params = req.query;
    var flightIds = params.flightIds;
    if (!flightIds) {
        return res.status(400).send("Flight ids are required");
    }
    var options = {
        url: config.engineUrl + '/getFlightsById',
        qs: {
            flightIds: flightIds
        }
    };
    http.get(options, function (err, response) {
        if (err) {
            return res.sendStatus(500);
        }
        // TODO: Implement check for double flights
        var flights = JSON.parse(response.body);
        flights.forEach(function (flight) {
            db.ref("users/" + user.uid + "/flights")
                .push(flight);
        });
        return res
            .status(response.statusCode)
            .json(flights);
    });
}
exports.create = create;
