import * as express from "express";
import { Api } from "./api";
import { GoogleAssistantHook } from "./hook";
import * as bodyparser from "body-parser";
import * as firebase from "./helpers/firebase.helper";
import * as http from "http";
import * as ws from "ws";

const port = process.env.PORT || 3000;
const app = express();
const api = new Api();
const hook = new GoogleAssistantHook();
const server = http.createServer(app);
const wss = new ws.Server({ server });


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

// CORS
app.use('/', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// Routes
app.use(bodyparser.json());
app.use('/', api.router);
app.use('/hook', hook.router);
app.use('/migrate', firebase.migrateUser);
wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    console.log("Incoming msg: ", data);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  //ws.on('message', function incoming(data) {
  //  let msg:any = data.valueOf();
  //  switch(msg.type) {
  //    case 'order':
  //      // SEND TO EVERYONE
  //    default:
  //      console.log("Unable to handle type: " + msg.type);
  //  }
  //});
});

server.listen(port, () => {
  firebase.setup();
  console.log(`AA Backend started on port ${port}`)
});
