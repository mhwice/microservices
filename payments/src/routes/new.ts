import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from "@mwecomm/common";
import { Order } from "../models/order";

const router = express.Router();

router.post("/api/payments",requireAuth, [
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
], validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
  if (order.status === OrderStatus.Cancelled) throw new BadRequestError("Order has been cancelled");
  res.send({ success: true });
});

export { router as createChargeRouter };
