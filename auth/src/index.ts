import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {

  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Auth Listening on 3000");
  });
}

// probably don't need to wrap everything in the start fn
// now that node supports top-level async-await
start();
