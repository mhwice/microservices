export enum OrderStatus {
  // Order created, ticket not reserved
  Created = "created",
  // User cancels order, or, ticket is already reserved/unavailable (expires or removed)
  Cancelled = "cancelled",
  // Ticket successfully reserved, but not payed for
  AwaitingPayment = "awaiting:payment",
  // Reserved ticket has been payed for
  Complete = "complete"
}
