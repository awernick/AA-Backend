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
    const flightNumber = app.getArgument(flightNumberArg);
    const tag = app.getArgument(givenNameArg);

    if(!tag || !flightNumber) {
      return app.tell("Sorry, I couldn't tag your flight. Please try again");
    }
    else {
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

    var departAirport: Date | null;
    var departTime: Date | null;
    var arrivalDate: Date | null;
    var arrivalAirport: Date | null;


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
          return app
            .tell(`Found it! ${tag}\'s flight will leave from ${departAirport} at ${departTime} and arrive on ${arrivalDate} at the ${arrivalAirport}.`);
        })
    }
  }

  public flightArrival(req: Request, res: Response) {
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const flightNumber = app.getArgument(flightNumberArg);

    if(flightNumber == null) {
      return app
        .tell('The flight ${flightNumber} will arrive at ${Date} to ${Airport}');
    } else {
      return app
        .tell('You will arrive at ${airport} by ${Date}.');
    }
  }

  public flightDeparture(req: Request, res: Response) {
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const flightNumber = app.getArgument(flightNumberArg);
    if(flightNumber == null) {
      return app
        .tell('The flight ${flightNumber} leaves at ${Date} from ${Airport}');
    } else {
      return app
        .tell('Your next flight to ${Airport} leaves at ${Date}.');
    }
  }

  public flightInformation(req: Request, res: Response) {
    const app: any = res.locals.app;
    const db: firebase.database.Database = res.locals.db;
    const flightNumber = app.getArgument(flightNumberArg);

    if(flightNumber == null) {
      return app
        .tell('The flight ${flightNumber} will leave from ${departAirport} at ${departTime} and arrive on ${arrivalDate} at the ${arrivalAirport}.');
      // GET FLIGHT NUMBER 
    } else {
      return app
        .tell('Found it! ${tag}\'s flight will leave from ${departAirport} at ${departTime} and arrive on ${arrivalDate} at the ${arrivalAirport}.');
      // GET USER'S NEXT FLIGHT
    }
  }
}

export { GoogleAssistantHook };
