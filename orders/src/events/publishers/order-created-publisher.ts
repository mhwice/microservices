import { Publisher, OrderCreatedEvent, Subjects } from "@mwecomm/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
