import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 123
  });
  await ticket.save();
  return ticket;
}

it("fetches orders for a particular user", async () => {

  // 1. Create 3 tickets
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  // 2. Create one order as User #1
  const user1 = global.signin();
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: t1.id })
    .expect(201);

  // 3. Create two orders as User #2
  const user2 = global.signin();
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: t2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: t3.id })
    .expect(201);

  // 4. Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  // 5. Make sure we only got the orders from User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(t2.id);
  expect(response.body[1].ticket.id).toEqual(t3.id);
});
