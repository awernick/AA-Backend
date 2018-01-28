"use strict";
//
// airport.api
//
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("request");
const config = require("../config");
const paths = {
    index: '/airports',
};
function index(req, res) {
    const options = {
        url: config.engineUrl + paths.index,
        qs: req.query
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
exports.index = index;
