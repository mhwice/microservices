import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

// fill out actual key here....
// process.env.STRIPE_KEY = "";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "test";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {

  jest.clearAllMocks();

  const collections = await mongoose.connection.db?.collections();
  if (!collections) return;
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a jwt payload with { id, email }
  const payload = { id: id || new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" };
  // Create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build the session object { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Encode JSON as Base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // Return string thats the cookie with the encoded data
  return [`session=${base64}`];
}
