//
// reservation.api
//

import { Request, Response } from "express";
import * as config from "../config";
import * as http from "request";

export function show(req: Request, res: Response) {

}

export function create(req: Request, res: Response) {
  const user = res.locals.user;
  const db: firebase.database.Database = res.locals.db;
  const params = req.query;
  const flightIds = params.flightIds;

  if(!flightIds) {
    return res.status(400).send("Flight ids are required");
  }
  
  const options = {
    url: config.engineUrl + '/getFlightsById',
    qs: { 
      flightIds: flightIds 
    }
  }

  http.get(options, (err, response) => {
    if(err) { return res.sendStatus(500) }

    // TODO: Implement check for double flights
    const flights = JSON.parse(response.body);
    flights.forEach((flight: any) => {
      db.ref("users/"+user.uid+"/flights")
        .push(flight);
    })

    return res
      .status(response.statusCode)
      .json(flights);
  });
}
