//
// airport.api
//

import { Request, Response } from "express";
import * as http from "request";
import * as config from "../config";
import * as qs from "querystring";

const paths = {
  index: '/airports',
}

export function index(req: Request, res: Response) {
  const options = {
    url: config.engineUrl + paths.index,
    qs: req.query,
  }

  http.get(options, (err, response) => {
    if(err) {
      return res.sendStatus(500);
    }
    
    return res
      .status(response.statusCode)
      .send(response.body);
  });
}


