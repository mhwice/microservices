import { Publisher, OrderCancelledEvent, Subjects } from "@mwecomm/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
