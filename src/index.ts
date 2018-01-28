import * as express from "express";
import { Api } from "./api";
import { GoogleAssistantHook } from "./hook";
import * as bodyparser from "body-parser";
import * as firebase from "./helpers/firebase.helper";

const port = process.env.PORT || 3000;
const app = express();
const api = new Api();
const hook = new GoogleAssistantHook();

app.use('/', (req, res, next) => {
  // CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use(bodyparser.json());

// Database
app.use((req, res, next) => {
  res.locals.db = firebase.getInstance().database();
  next();
})

// Email
app.use((req, res, next) => {
  res.locals.user = {
    email: 'alanwernick242@gmail.com',
    uid: '-L3vh6rdAC374-8t13oA'
  }
  next();
})

// Routes
app.use('/', api.router);
app.use('/hook', hook.router);
app.use('/migrate', firebase.migrateUser);

app.listen(port, () => {
  firebase.setup();
  console.log(`AA Backend started on port ${port}`)
});
