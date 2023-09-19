import { Document, Schema, model } from "mongoose";
import { ITrip } from "../interfaces/trip.interface";



const tripSchema: Schema = new Schema(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: 'Lunch'
    },
    sent_at: {
      type: Number,
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref:'Org'
    },
    agree_users: {

    },
    disagree_users: {

    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);


const tripModel = model<ITrip & Document>('Trip',tripSchema);


export default tripModel;