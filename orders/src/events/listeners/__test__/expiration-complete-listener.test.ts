import { ExpirationCompleteEvent, OrderStatus } from "@mwecomm/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
  // 1. create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  // 2. create a ticket and order
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "store",
    price: 5
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "abc",
    expiresAt: new Date(),
    ticket: ticket
  });
  await order.save();

  // 3. create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id
  }

  // 4. create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket, order };
};

it("updates the order status to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelledEvent", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
