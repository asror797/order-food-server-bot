import { Schema, model } from "mongoose";
import { ILunch } from "../interfaces/lunch.interface";
import { Document } from "mongoose";

const lunchSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref:'Product'
          },
          amount: {
            type: Number,
            default: 0
          }
        }
      ],
      default: []
    },
    org: {
      type: Schema.Types.ObjectId,
      ref:'Org',
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const lunchModel = model<ILunch & Document>('Lunch',lunchSchema);

export default lunchModel