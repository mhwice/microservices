import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "pass1234"
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "notanemail",
      password: "pass1234"
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "p"
    })
    .expect(400);
});

it("returns a 400 with an missing email or password", async () => {

  await request(app)
  .post("/api/users/signup")
  .send({
    emai: "myemail@test.com"
  })
  .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "pass1234"
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "pass1234"
    })
    .expect(201);

    await request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "pass5678"
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "myemail@test.com",
      password: "pass1234"
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
