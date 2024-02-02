import { Document, Schema, model } from 'mongoose'
import { ITrip } from '../interfaces/trip.interface'

const attendedUserSchema: Schema = new Schema({
  lunch: {
    type: Schema.Types.ObjectId,
    ref: 'Lunch',
  },
  total: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const tripSchema: Schema = new Schema(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: 'LunchBase',
    },
    sent_at: {
      type: Number,
      required: true,
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
    },
    candidates: [attendedUserSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const tripModel = model<ITrip & Document>('Trip', tripSchema)
