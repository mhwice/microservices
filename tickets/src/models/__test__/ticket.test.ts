import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // 1. Create an instance of a ticket
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "123" });
  // 2. Save the ticket to the database
  await ticket.save();
  // 3. Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // 4. Make two separate changes to the tickets
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // 5. Save the first fetch ticket
  await firstInstance!.save();
  // 6. Save the second fetch ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reacht this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "123" });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
