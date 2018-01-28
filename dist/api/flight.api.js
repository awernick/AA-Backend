"use strict";
//
// flight.api
//
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("request");
var config = require("../config");
var paths = {
    index: '/flights',
    show: '/flight',
    status: '/flightStatus'
};
function index(req, res) {
    var user = res.locals.user;
    var db = res.locals.db;
    db.ref('users/' + user.uid + '/flights').once('value', function (records) {
        var flights = [];
        records.forEach(function (flightRecord) {
            var flight = flightRecord.val();
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
    var options = {
        url: config.engineUrl + paths.show,
        qs: req.query,
    };
    http.get(options, function (err, response) {
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
    http.get(config.engineUrl + paths.status, function () {
    });
}
exports.status = status;
