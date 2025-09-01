import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {

  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB....");
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
