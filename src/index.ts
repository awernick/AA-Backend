import * as express from "express";
import { Api } from "./api";
import { GoogleAssistantHook } from "./hook";
import * as bodyparser from "body-parser";

const port = process.env.PORT || 3000;
const app = express();
const api = new Api();
const hook = new GoogleAssistantHook();

app.use(bodyparser.json());
app.use('/', api.router);
app.use('/', (req, res, next) => {
  // CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use('/hook', hook.router);
app.listen(port, () => console.log(`AA Backend started on port ${port}`));
