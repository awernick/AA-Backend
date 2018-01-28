import { Router } from "express";
import { Request, Response } from "express";
import * as firebase from "firebase";

const { DialogflowApp } = require('actions-on-google');

const flightNumberArg = 'flight-number';
const givenNameArg = 'given-name';

class GoogleAssistantHook {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setup();
  }

  public setup() {
    this.router.post('/', this.hook.bind(this));
  }

  public hook(req: Request, res: Response) {
    const app = new DialogflowApp({ request: req, response: res });
    const intent = app.getIntent();
    res.locals.app = app;

    switch(intent) {
      case 'createFlightTag':
        return this.createFlightTag(req, res);
      case 'findFlightTag':
        return this.findFlightTag(req, res);
      case 'flightArrival':
        return this.flightArrival(req, res);
      case 'flightDeparture':
        return this.flightDeparture(req, res);
      case 'flightInformation':
        return this.flightInformation(req, res);
      default:
        return app
          .tell("Sorry, I couldn't find what you were trying to do");
    }
  }

  public createFlightTag(req: Request, res: Response) {
    const app = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const user = res.locals.user;
    const tag = app.getArgument(givenNameArg);
    console.log(tag);
    let flightNumber = app.getArgument(flightNumberArg);


    if(!tag || !flightNumber) {
      return app.tell("Sorry, I couldn't tag your flight. Please try again");
    }
    else {
      flightNumber = flightNumber.split(' ')[1];
      db.ref('users/' + user.uid +'/tags/'+ tag)
        .set({
          flightNumber: flightNumber
        })

      return app.tell(`Ready! You can now track ${tag}'s flight!`);
    }
  }

  public findFlightTag(req: Request, res: Response){
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const user = res.locals.user;
    const tag = app.getArgument(givenNameArg);

    if(!tag) {
      return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
    }
    else {
      db.ref('users/' + user.uid +'/tags/'+tag)
        .once('value', (record) => {
          if(record.val() == null) {
            return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
          }

          const flightNumber = record.val().flightNumber;
          this.findFlightByNumber(res.locals, flightNumber)
            .then((flight:any) => {
              const origin = flight.origin
              const destination = flight.destination;
              const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
              const arrivalTime = new Date(flight.arrivalTime).toLocaleString('en-US');

              return app
                  .tell(`Found it! ${tag}\'s flight will leave from ${origin} at ${departureTime} and arrive on ${arrivalTime} at the ${destination}.`);
            })
            .catch(() => {
              return app
                .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
            })
        })
    }
  }

  public flightArrival(req: Request, res: Response) {
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    let flightNumber = app.getArgument(flightNumberArg);

    this.loadFlight(res.locals, flightNumber)
      .then((flight: any) => {
        const origin = flight.origin
        const destination = flight.destination;
        const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
        const arrivalTime = new Date(flight.arrivalTime).toLocaleString('en-US');

        if(!flightNumber) {
          return app
            .tell(`Your next flight will arrive at ${arrivalTime} to ${destination}`);
        }
        return app
          .tell(`The flight AA${flightNumber} will arrive at ${arrivalTime} to ${destination}`);
      })
      .catch(() => {
        return app
          .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
      })
  }

  public flightDeparture(req: Request, res: Response) {
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const flightNumber = app.getArgument(flightNumberArg);

    this.loadFlight(res.locals, flightNumber)
      .then((flight: any) => {
        const destination = flight.destination;
        const departureTime = new Date(flight.departureTime).toLocaleString('en-US');

        if(!flightNumber) {
          return app
            .tell(`Your next flight leaves at ${departureTime} from ${destination}`);
        }

        return app
          .tell(`The flight AA${flightNumber} leaves at ${departureTime} from ${destination}`);
      })
      .catch(() => {
        return app
          .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
      })
  }

  public flightInformation(req: Request, res: Response) {
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const flightNumber = app.getArgument(flightNumberArg);

    this.loadFlight(res.locals, flightNumber)
      .then((flight: any) => {
        const origin = flight.origin
        const destination = flight.destination;
        const departureTime = new Date(flight.departureTime).toLocaleString('en-US');
        const arrivalTime = new Date(flight.arrivalTime).toLocaleString('en-US');

        if(!flightNumber) {
          return app
            .tell(`Your next flight will leave from ${origin} at ${destination} and arrive on ${arrivalTime} at the ${destination}.`);
        }
          return app
            .tell(`The flight ${flightNumber} will leave from ${origin} at ${destination} and arrive on ${arrivalTime} at the ${destination}.`);
      })
      .catch(() => {
        return app
          .tell("Sorry, I couldn't find your flight. Please make sure the flight number is correct");
      })
  }

  private loadFlight(locals: any, flightNumber?: string) {
    return new Promise((resolve, reject) => {
      if(!flightNumber) {
        this.loadFlights(locals)
          .then((flights: Array<any>) => {
            if(flights.length == 0) {
              return reject();
            }

            flightNumber = flights[0].flightNumber
            return resolve(flightNumber);
          })
      } else {
        let numParts = flightNumber.split(' ');
        if(numParts.length == 1) {
          return resolve(flightNumber);
        }
        return resolve(numParts[1]);
      }
    })
      .then((flightNumber: string) => {
        console.log(flightNumber);
        return this.findFlightByNumber(locals, flightNumber)
      })
  }


  private findFlightByNumber(locals: any, flightNumber: string) {
    const db: firebase.database.Database  = locals.db;
    const user = locals.user;

    return new Promise((resolve, reject) => {
      db.ref('users/'+user.uid+'/flights').once('value', (records) => {
        let found = false;
        records.forEach((flightRecord) => {
          const flight = flightRecord.val();
          if(flight == null) { return false }
          else if(flight.flightNumber == flightNumber) {
            found = true;
            resolve(flight);
            return found;
          }
          else { return false }
        })
        if(found) { return; }
        return reject();
      })
    })
  }

  private loadFlights(locals: any) {
    const user = locals.user;
    const db: firebase.database.Database = locals.db;

    return new Promise((resolve, reject) => {
      db.ref('users/'+user.uid+'/flights').once('value', (records) => {
        let flights: any[] = [];
        records.forEach((flightRecord) => {
          const flight = flightRecord.val();
          if(flight == null) { return false }
          flights.push(flight);
        })
        return resolve(flights);
      })
    })
  }
}


export { GoogleAssistantHook };
