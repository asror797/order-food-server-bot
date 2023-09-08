import { Document, Schema, model } from "mongoose";
import { IProduct } from "../interfaces/product.interface";



const productSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      default:0
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);


const productModel = model<IProduct & Document >('Product',productSchema);

export default productModel;