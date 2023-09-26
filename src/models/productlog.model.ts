import { Document, Schema, model } from "mongoose";
import { IProductLog } from "../interfaces/productlog.interface";

const productLog: Schema = new Schema(
  { 
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref:'Org',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    type: {
      type: Boolean,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const productLogModel = model<IProductLog & Document>('ProductLog',productLog);

export default productLogModel;