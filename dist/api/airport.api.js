"use strict";
//
// airport.api
//
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("request");
var config = require("../config");
var paths = {
    index: '/airports',
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
