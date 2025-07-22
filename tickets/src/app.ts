import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@mwecomm/common";
import { createTicketRotuer } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
// we are using NGINX as a proxy - express doesnt like that by default
app.set("trust proxy", true);
app.use(json());
// disable encryption so easy to change service language and implementation
app.use(cookieSession({
  signed: false,
  // in the test environment we must disable secure or tests will fail
  secure: process.env.NODE_ENV !== "test"
}));

app.use(currentUser);

app.use(createTicketRotuer);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
