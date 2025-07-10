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
