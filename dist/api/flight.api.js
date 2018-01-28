"use strict";
//
// flight.api
//
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("request");
const config = require("../config");
const paths = {
    index: '/flights',
    show: '/flight',
    status: '/flightStatus'
};
function index(req, res) {
    const user = res.locals.user;
    const db = res.locals.db;
    db.ref('users/' + user.uid + '/flights').once('value', (records) => {
        let flights = [];
        records.forEach((flightRecord) => {
            const flight = flightRecord.val();
            if (flight == null) {
                return false;
            }
            flights.push(flight);
        });
        return res.json(flights);
    });
    //const options = {
    //  url: config.engineUrl + paths.index,
    //  qs: req.query,
    //}
    //http.get(options, (err, response) => {
    //  if(err) {
    //    return res.sendStatus(500);
    //  }
    //  
    //  return res
    //    .status(response.statusCode)
    //    .send(response.body);
    //});
}
exports.index = index;
function show(req, res) {
    const options = {
        url: config.engineUrl + paths.show,
        qs: req.query,
    };
    http.get(options, (err, response) => {
        if (err) {
            return res.sendStatus(500);
        }
        return res
            .status(response.statusCode)
            .send(response.body);
    });
}
exports.show = show;
function status(req, res) {
    http.get(config.engineUrl + paths.status, () => {
    });
}
exports.status = status;
