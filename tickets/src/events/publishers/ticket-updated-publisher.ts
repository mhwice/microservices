import { Publisher, Subjects, TicketUpdatedEvent } from "@mwecomm/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
