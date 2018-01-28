"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let data = require('../../data/items.json');
function index(req, res) {
    return res.json(data);
}
exports.index = index;
