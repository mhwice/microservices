import { Publisher, PaymentCreatedEvent, Subjects } from "@mwecomm/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
