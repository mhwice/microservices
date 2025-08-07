import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {

  // 1. Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 123
  });
  await ticket.save();

  // 2. Create one order
  const user1 = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  // 3. Make request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user1)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  // 1. Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 123
  });
  await ticket.save();

  // 2. Create one order
  const user1 = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  // 3. Make request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user1)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
