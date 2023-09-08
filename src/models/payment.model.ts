import { Schema, model } from "mongoose";
import { IPayment } from "../interfaces/payment.interface";


const paymentSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref:'User',
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref:'Org',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);


const paymentModel = model<IPayment & Document>('Payment',paymentSchema);

export default paymentModel;