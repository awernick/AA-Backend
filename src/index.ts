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
app.use('/hook', hook.router);
app.listen(port, () => console.log(`AA Backend started on port ${port}`));
