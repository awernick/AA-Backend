import { Router } from "express";
import * as UserApi from "./user.api";
import * as FlightApi from "./flight.api";
import * as OrderApi from "./order.api";
import * as ReservationApi from "./reservation.api"
import * as AirportApi from "./airport.api";

class Api {
  public router: Router;

  constructor() {
    this.router = Router();
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
  }
}

export { Api };
