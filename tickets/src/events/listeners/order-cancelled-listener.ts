import { Listener, OrderCancelledEvent, Subjects } from "@mwecomm/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // 1. Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // 2. If no ticket, throw an error
    if (!ticket) throw new Error("Ticket not found");
    // 3. Mark the ticket as being not reserved by setting its orderId property
    ticket.set({ orderId: undefined });
    // 4. Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    });

    // 5. Ack the message
    msg.ack();
  }
}
