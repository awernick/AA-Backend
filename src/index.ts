import * as express from "express";
import { Api } from "./api";

const port = process.env.PORT || 3000;
const app = express();
const api = new Api();

app.use('/', api.router);
app.listen(port, () => console.log(`AA Backend started on port ${port}`));
