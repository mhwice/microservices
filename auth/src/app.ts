import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
