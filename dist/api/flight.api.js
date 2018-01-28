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
    var options = {
        url: config.engineUrl + paths.index,
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
