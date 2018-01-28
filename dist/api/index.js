"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserApi = require("./user.api");
var FlightApi = require("./flight.api");
var OrderApi = require("./order.api");
var ReservationApi = require("./reservation.api");
var AirportApi = require("./airport.api");
var Api = /** @class */ (function () {
    function Api() {
        this.router = express_1.Router();
        this.setup();
    }
    Api.prototype.setup = function () {
        // Mock
        //this.router.post('/mock', mockApi.index);
        // Users
        this.router.get('/user', UserApi.show);
        this.router.post('/user', UserApi.create);
        // Reservation
        this.router.get('/reservation', ReservationApi.show);
        this.router.post('/reservation', ReservationApi.create);
        // Flight
        this.router.get('/flight', FlightApi.show);
        this.router.get('/flights', FlightApi.index);
        this.router.post('/flightStatus', FlightApi.status);
        // Airports
        this.router.get('/airports', AirportApi.index);
        // Orders
        this.router.get('/order', OrderApi.show);
        this.router.post('/order', OrderApi.create);
        this.router.get('/orders', OrderApi.index);
    };
    return Api;
}());
exports.Api = Api;
