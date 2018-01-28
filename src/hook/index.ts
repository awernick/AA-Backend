import { Router } from "express";
import { Request, Response } from "express";
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
    this.router.get('/', function(req: Request, res: Response) {
      let app = new DialogflowApp({ request: req, response: res });
      const intent = app.getIntent();

      switch(intent) {
        case 'createFlightTag':
          return this.createFlightTag(app);
        case 'findFlightTag':
          return this.findFlightTag(app);
        case 'flightArrival':
          return this.flightArrival(app);
        case 'flightDeparture':
          return this.flightDeparture(app);
        case 'flightInformation':
          return this.flightInformation(app);
        default:
          return app
            .tell("Sorry, I couldn't find what you were trying to do");
      }
    });
  }

  public createFlightTag(app: any) {
    const flightNumber = app.getArgument(flightNumberArg);
    const tag = app.getArgument(givenNameArg);

    if(!tag || !flightNumber) {
      return app.tell("Sorry, I couldn't tag your flight. Please try again");
    }
    else {
      // TAGGING CODE HERE
      return app.tell(`Ready! You can now track ${tag}'s flight!`);
    }
  }

  public findFlightTag(app: any) {
    const flightNumber = app.getArgument(flightNumberArg);
    const tag = app.getArgument(givenNameArg);
    var departAirport: Date | null;
    var departTime: Date | null;
    var arrivalDate: Date | null;
    var arrivalAirport: Date | null;


    if(!tag || !flightNumber) {
      return app.tell("Sorry, I couldn't find the tag you looked for. Please try again.");
    }
    else {
      // TAGGING CODE HERE
      return app
        .tell('Found it! ${tag}\'s flight will leave from ${departAirport} at ${departTime} and arrive on ${arrivalDate} at the ${arrivalAirport}.');
    }
  }

  public flightArrival(app: any) {
    const flightNumber = app.getArgument(flightNumberArg);
    if(flightNumber == null) {
      return app
        .tell('The flight ${flightNumber} will arrive at ${Date} to ${Airport}');
    } else {
      return app
        .tell('You will arrive at ${airport} by ${Date}.');
    }
  }

  public flightDeparture(app: any) {
    const flightNumber = app.getArgument(flightNumberArg);
    if(flightNumber == null) {
      return app
        .tell('The flight ${flightNumber} leaves at ${Date} from ${Airport}');
    } else {
      return app
        .tell('Your next flight to ${Airport} leaves at ${Date}.');
    }
  }

  public flightInformation(app: any) {
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
