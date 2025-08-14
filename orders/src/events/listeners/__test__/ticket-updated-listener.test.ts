import { TicketUpdatedEvent } from "@mwecomm/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // 1. create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // 2. create an save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: "lunch"
  });
  await ticket.save();

  // 3. create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "dinner",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString()
  }
  // 4. create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, ticket, msg };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup();
  // 4. call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // 5. write assertions to make sure a ticket was updated
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // 4. call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);
  // 5. write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
