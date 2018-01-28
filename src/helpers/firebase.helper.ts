import { Request, Response } from "express";
import * as firebase from "firebase-admin";

const serviceAccountKeys = require('../../service-account.json');
//const config = {
//  apiKey: "AIzaSyCrfqNNTnd8-iTWv53_zrcPovrUHWwMr54",
//  authDomain: "aa-assistant-3b704.firebaseapp.com",
//  databaseURL: "https://aa-assistant-3b704.firebaseio.com",
//  projectId: "aa-assistant-3b704",
//  storageBucket: "aa-assistant-3b704.appspot.com",
//  messagingSenderId: "115030624423"
//};

const config = {
  credential: firebase.credential.cert(serviceAccountKeys),
  databaseURL: "https://aa-assistant-3b704.firebaseio.com",
}

let app: firebase.app.App;

export function setup() {
  app = firebase.initializeApp(config);
  const db: firebase.database.Database = app.database();
  console.log("Firebase started");
}

export function getInstance() {
  if(!app) {
    throw new Error('Firebase must be setup first');
  }
  return app;
}

export function migrateUser(req: Request, res: Response) {
  const db = app.database();
  const user = res.locals.user;
  const userRef = db.ref('users')
  userRef
    .push()
    .set({
      email: user.email
    })
  return res.sendStatus(200);
}
