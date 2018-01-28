"use strict";
//
// user.api
//
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("request");
var config = require("../config");
var paths = {
    show: '/user',
    create: '/user'
};
function show(req, res) {
    var options = {
        url: config.engineUrl + paths.show,
        qs: req.query,
        json: true
    };
    http.get(options, function (err, response) {
        if (err) {
            return res.sendStatus(500);
        }
        return res
            .status(response.statusCode)
            .json(response.body);
    });
}
exports.show = show;
function create(req, res) {
    var options = {
        url: config.engineUrl + paths.create,
        qs: req.query,
        json: true
    };
    http.post(options, function (err, response) {
        if (err) {
            return res.sendStatus(500);
        }
        return res
            .status(response.statusCode)
            .json(response.body);
    });
}
exports.create = create;
