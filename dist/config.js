"use strict";
var ENGINE_URL = 'https://aa-engine.herokuapp.com';
var LOCAL_ENGINE_URL = 'http://localhost:3030';
var config = {
    engineUrl: process.env.NODE_ENV == 'debug' ? LOCAL_ENGINE_URL : ENGINE_URL
};
module.exports = config;
