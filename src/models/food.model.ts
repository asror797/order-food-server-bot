import { Document, Schema, model } from "mongoose";
import { Category, IFood } from "../interfaces/food.interface";

const foodSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      default: 0
    },
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          amount: {
            type: Number,
            required: true
          }
        }
      ],
      default:[]
    },
    org: {
      type: Schema.Types.ObjectId,
      ref:'Org',
      required: true
    },
    category: {
      type: String,
      enum: Object.values(Category)
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const foodModel = model<IFood & Document>('Food',foodSchema);

export default foodModel;