//
// user.api
//

import { Request, Response } from "express";
import * as http from "request";
import * as config from "../config";
import * as qs from "querystring";

const paths = {
  show: '/user',
  create: '/user'
}

export function show(req: Request, res: Response) {
  const options = {
    url: config.engineUrl + paths.show,
    qs: req.query,
    json: true
  }

  http.get(options, (err, response) => {
    if(err) {
      return res.sendStatus(500);
    }

    return res
      .status(response.statusCode)
      .json(response.body)
  });
}

export function create(req: Request, res: Response) {
  const options = {
    url: config.engineUrl + paths.create,
    qs: req.query,
    json: true
  }

  http.post(options, (err, response) => {
    if(err) { return res.sendStatus(500)}

    return res
      .status(response.statusCode)
      .json(response.body);
  });
}
