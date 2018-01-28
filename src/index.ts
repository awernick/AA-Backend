import * as express from "express";
import { Api } from "./api";
import { GoogleAssistantHook } from "./hook";
import * as bodyparser from "body-parser";
import * as firebase from "firebase";

const port = process.env.PORT || 3000;
const app = express();
const api = new Api();
const hook = new GoogleAssistantHook();

const config = {
  apiKey: "<API_KEY>",
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
}

app.use(bodyparser.json());
app.use((req, res) => {
})
app.use('/', api.router);
app.use('/hook', hook.router);
app.listen(port, () => console.log(`AA Backend started on port ${port}`));
