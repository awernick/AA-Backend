//
// items.api.ts
//
import { Request, Response } from "express";
let data = require('../../data/items.json');

export function index(req: Request, res: Response) {
  return res.json(data);
}
