"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserApi = require("./user.api");
const FlightApi = require("./flight.api");
const OrderApi = require("./order.api");
const ReservationApi = require("./reservation.api");
const AirportApi = require("./airport.api");
const ItemsApi = require("./items.api");
class Api {
    constructor() {
        this.router = express_1.Router();
        this.setup();
    }
    setup() {
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
        // Items
        this.router.get('/items', ItemsApi.index);
    }
}
exports.Api = Api;
