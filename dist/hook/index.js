"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http = require("request");
const async = require("async");
const config = require("../config");
const { DialogflowApp } = require('actions-on-google');
const flightNumberArg = 'flight-number';
const givenNameArg = 'given-name';
class GoogleAssistantHook {
    constructor() {
        this.router = express_1.Router();
        this.setup();
    }
    setup() {
        this.router.post('/', this.hook.bind(this));
    }
    hook(req, res) {
        const app = new DialogflowApp({ request: req, response: res });
        const intent = app.getIntent();
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
    }
    createFlightTag(req, res) {
        const app = res.locals.app;
        const db = res.locals.db;
        const user = res.locals.user;
        const tag = app.getArgument(givenNameArg);
        console.log(tag);
        let flightNumber = app.getArgument(flightNumberArg);
        if (!tag || !flightNumber) {
            return app.tell("Sorry, I couldn't tag your flight. Please try again");
        }
        else {
            flightNumber = flightNumber.split(' ')[1];
            db.ref('users/' + user.uid + '/tags/' + tag)
                .set({
                flightNumber: flightNumber
            });
            return app.tell(`Ready! You can now track ${tag}'s flight!`);
        }
    }
    findFlightTag(req, res) {
        const app = res.locals.app;
        const db = res.locals.db;
        const user = res.locals.user;
        const tag = app.getArgument(givenNameArg);
        if (!tag) {
            return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
        }
        else {
            db.ref('users/' + user.uid + '/tags/' + tag)
                .once('value', (record) => {
                if (record.val() == null) {
                    return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
                }
                const flightNumber = record.val().flightNumber;
                this.loadFlight(res.locals, flightNumber)
                    .then((flight) => {
                    const origin = flight.origin.name + " airport";
                    const destination = flight.destination.name + " airport";
                    const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
                    const arrivalTime = new Date(flight.arrivalTime).toLocaleString('en-US');
                    return app
                        .tell(`Found it! ${tag}\'s flight will leave from ${origin} at ${departureTime} and arrive on ${arrivalTime} at the ${destination}.`);
                })
                    .catch(() => {
                    return app
                        .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
                });
            });
        }
    }
    flightArrival(req, res) {
        const app = res.locals.app;
        const db = res.locals.db;
        let flightNumber = app.getArgument(flightNumberArg);
        this.loadFlight(res.locals, flightNumber)
            .then((flight) => {
            const origin = flight.origin.name + " airport";
            const destination = flight.destination.name + " airport";
            const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
            const arrivalTime = new Date(flight.arrivalTime).toLocaleString('en-US');
            if (!flightNumber) {
                return app
                    .tell(`Your next flight will arrive at ${arrivalTime} to ${destination}`);
            }
            return app
                .tell(`The flight ${flightNumber} will arrive at ${arrivalTime} to ${destination}`);
        })
            .catch(() => {
            return app
                .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
        });
    }
    flightDeparture(req, res) {
        const app = res.locals.app;
        const db = res.locals.db;
        const flightNumber = app.getArgument(flightNumberArg);
        this.loadFlight(res.locals, flightNumber)
            .then((flight) => {
            const destination = flight.destination.name + " airport";
            const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
            if (!flightNumber) {
                return app
                    .tell(`Your next flight leaves at ${departureTime} from ${destination}`);
            }
            return app
                .tell(`The flight ${flightNumber} leaves at ${departureTime} from ${destination}`);
        })
            .catch(() => {
            return app
                .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
        });
    }
    flightInformation(req, res) {
        const app = res.locals.app;
        const db = res.locals.db;
        const flightNumber = app.getArgument(flightNumberArg);
        this.loadFlight(res.locals, flightNumber)
            .then((flight) => {
            const origin = flight.origin.name + " airport";
            const destination = flight.destination.name + " airport";
            const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
            const arrivalTime = new Date(flight.arrivalTime).toLocaleString('en-US');
            if (!flightNumber) {
                return app
                    .tell(`Your next flight will leave from ${origin} at ${departureTime} and arrive on ${arrivalTime} at the ${destination}.`);
            }
            return app
                .tell(`The flight ${flightNumber} will leave from ${origin} at ${departureTime} and arrive on ${arrivalTime} at the ${destination}.`);
        })
            .catch(() => {
            return app
                .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
        });
    }
    loadFlight(locals, flightNumber) {
        return new Promise((resolve, reject) => {
            if (!flightNumber) {
                this.loadFlights(locals)
                    .then((flights) => {
                    if (flights.length == 0) {
                        return reject();
                    }
                    flightNumber = flights[0].flightNumber;
                    return resolve(flightNumber);
                });
            }
            else {
                return resolve(flightNumber);
            }
        })
            .then((flightNumber) => {
            return this.findFlightByNumber(locals, flightNumber);
        })
            .then((flight) => {
            return new Promise((resolve, reject) => {
                var tasks = [];
                tasks[0] = (cb) => {
                    this.getAirport(flight.destination)
                        .then((airport) => {
                        flight.destination = airport;
                        cb(null);
                    })
                        .catch(() => cb(new Error()));
                };
                tasks[1] = (cb) => {
                    this.getAirport(flight.origin)
                        .then((airport) => {
                        flight.origin = airport;
                        cb(null);
                    })
                        .catch(() => {
                        cb(new Error());
                    });
                };
                return async.parallel(tasks, (err, _) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(flight);
                });
            });
        });
    }
    findFlightByNumber(locals, flightNumber) {
        const db = locals.db;
        const user = locals.user;
        return new Promise((resolve, reject) => {
            db.ref('users/' + user.uid + '/flights').once('value', (records) => {
                let found = false;
                records.forEach((flightRecord) => {
                    const flight = flightRecord.val();
                    if (flight == null) {
                        return false;
                    }
                    else if (flight.flightNumber == flightNumber) {
                        found = true;
                        resolve(flight);
                        return found;
                    }
                    else {
                        return false;
                    }
                });
                if (found) {
                    return;
                }
                return reject();
            });
        });
    }
    loadFlights(locals) {
        const user = locals.user;
        const db = locals.db;
        return new Promise((resolve, reject) => {
            db.ref('users/' + user.uid + '/flights').once('value', (records) => {
                let flights = [];
                records.forEach((flightRecord) => {
                    const flight = flightRecord.val();
                    if (flight == null) {
                        return false;
                    }
                    flights.push(flight);
                });
                return resolve(flights);
            });
        });
    }
    getAirport(code) {
        let options = {
            url: config.engineUrl + '/airports',
            qs: { code },
            method: 'GET',
            json: true
        };
        return new Promise((resolve, reject) => {
            http.get(options, (err, res) => {
                if (err) {
                    reject(err);
                }
                else if (res.statusCode == 200) {
                    return resolve(res.body[0]);
                }
                else {
                    return reject(res.statusCode);
                }
            });
        });
    }
}
exports.GoogleAssistantHook = GoogleAssistantHook;
