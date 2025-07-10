import request from "supertest";
import { app } from "../../app";

it("fails when an email does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "randomemail@test.com",
      password: "pass1234"
    })
    .expect(400)
});

it("fails when an incorrect password is supplied", async () => {

  request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "pass1234"
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "myemail@test.com",
      password: "wrongpassword"
    })
    .expect(400)
});

it("responds with a cookie on successful signin", async () => {

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "pass1234"
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "myemail@test.com",
      password: "pass1234"
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
