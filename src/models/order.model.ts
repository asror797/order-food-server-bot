import { Document, Schema, model } from "mongoose";
import { IOrder } from "../interfaces/order.interface";



const orderSchema:Schema = new Schema(
  {

  },
  {
    versionKey: false,
    timestamps: true
  }
);


const orderModel = model<IOrder & Document>('Order',orderSchema);

export default orderModel;
