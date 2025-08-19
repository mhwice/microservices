import { OrderStatus } from "@mwecomm/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Do this to keep everything coming from a single file
// (just makes things easier to logic around)
export { OrderStatus };

// List of properties to provide when building an order
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// List of properties an order has
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// List of properties the model itself contains
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  }
}, {
  toJSON: {
    transform(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

