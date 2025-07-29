import { Publisher, Subjects, TicketCreatedEvent } from "@mwecomm/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
