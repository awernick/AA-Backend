import { Router } from "express";
import { Request, Response } from "express";

const { DialogflowApp } = require('actions-on-google');
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
        case 'createFligthTag':
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
  }

  public findFlightTag(app: any) {
  }

  public flightArrival(app: any) {
  }

  public flightDeparture(app: any) {
  }

  public flightInformation(app: any) {
  }
}

export { GoogleAssistantHook };
