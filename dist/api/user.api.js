"use strict";
//
// user.api
//
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("request");
const config = require("../config");
const paths = {
    show: '/user',
    create: '/user'
};
function show(req, res) {
    const options = {
        url: config.engineUrl + paths.show,
        qs: req.query,
        json: true
    };
    http.get(options, (err, response) => {
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
    const options = {
        url: config.engineUrl + paths.create,
        qs: req.query,
        json: true
    };
    http.post(options, (err, response) => {
        if (err) {
            return res.sendStatus(500);
        }
        return res
            .status(response.statusCode)
            .json(response.body);
    });
}
exports.create = create;
