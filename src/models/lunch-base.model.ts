import { Document, Schema, model } from "mongoose";
import { ILunchBase } from "../interfaces/lunch-base.interface";

const lunchBaseSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref:'Org',
      required: true
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const lunchBaseModel = model<ILunchBase & Document>('LunchBase',lunchBaseSchema)

export default lunchBaseModel