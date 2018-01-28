//
// flight.api
//

import { Request, Response } from "express";
import * as http from "request";
import * as config from "../config";
import * as qs from "querystring";
import * as firebase from "firebase-admin";

const paths = {
  index: '/flights',
  show: '/flight',
  status: '/flightStatus'
}

export function index(req: Request, res: Response) {
  const user = res.locals.user;
  const db: firebase.database.Database = res.locals.db;

  db.ref('users/'+user.uid+'/flights').once('value', (records) => {
    let flights: any[] = [];
    records.forEach((flightRecord) => {
      const flight = flightRecord.val();
      if(flight == null) { return false }
      flights.push(flight);
    })
    return res.json(flights)
  })

  //const options = {
  //  url: config.engineUrl + paths.index,
  //  qs: req.query,
  //}

  //http.get(options, (err, response) => {
  //  if(err) {
  //    return res.sendStatus(500);
  //  }
  //  
  //  return res
  //    .status(response.statusCode)
  //    .send(response.body);
  //});
}

export function show(req: Request, res: Response) {
  const options = {
    url: config.engineUrl + paths.show,
    qs: req.query,
  }

  http.get(options, (err, response) => {
    if(err) {
      return res.sendStatus(500);
    }

    return res
      .status(response.statusCode)
      .send(response.body)
  });
}

export function status(req: Request, res: Response) {
  http.get(config.engineUrl + paths.status, () => {
  });
}
