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

export default lunchModel;