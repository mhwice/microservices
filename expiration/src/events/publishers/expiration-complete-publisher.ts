import { Publisher, Subjects, ExpirationCompleteEvent } from "@mwecomm/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
