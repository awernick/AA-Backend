"use strict";
//
// reservation.api
//
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config");
const http = require("request");
function show(req, res) {
}
exports.show = show;
function create(req, res) {
    const user = res.locals.user;
    const db = res.locals.db;
    const params = req.query;
    const flightIds = params.flightIds;
    if (!flightIds) {
        return res.status(400).send("Flight ids are required");
    }
    const options = {
        url: config.engineUrl + '/getFlightsById',
        qs: {
            flightIds: flightIds
        }
    };
    http.get(options, (err, response) => {
        if (err) {
            return res.sendStatus(500);
        }
        // TODO: Implement check for double flights
        const flights = JSON.parse(response.body);
        flights.forEach((flight) => {
            db.ref("users/" + user.uid + "/flights")
                .push(flight);
        });
        return res
            .status(response.statusCode)
            .json(flights);
    });
}
exports.create = create;
