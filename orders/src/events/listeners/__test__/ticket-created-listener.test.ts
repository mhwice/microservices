import { TicketCreatedEvent } from "@mwecomm/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // 1. create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // 2. create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }
  // 3. create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
};

it("creates and save a ticket", async () => {
  const { listener, data, msg } = await setup();
  // 4. call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // 5. write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // 4. call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // 5. write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
