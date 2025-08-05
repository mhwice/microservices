import { NotFoundError, requireAuth, validateRequest } from "@mwecomm/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post("/api/orders", requireAuth, [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("ticketId must be provided")
], validateRequest, async (req: Request, res: Response) => {

  const { ticketId } = req.body;

  // 1. Find the ticket, the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new NotFoundError();

  // 2. Make sure that this ticket is not already reserved
  // 3. Calculate an expiration date for this order
  // 4. Build the order and save it to the database
  // 5. Publish an event saying that an order was created

  res.send({});
});

export { router as newOrderRouter };
