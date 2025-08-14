import { Listener, OrderCreatedEvent, Subjects } from "@mwecomm/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // 1. Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // 2. If no ticket, throw an error
    if (!ticket) throw new Error("Ticket not found");
    // 3. Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    // 4. Save the ticket
    await ticket.save();
    // 5. Ack the message
    msg.ack();
  }
}
