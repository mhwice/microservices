import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@mwecomm/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

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

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
