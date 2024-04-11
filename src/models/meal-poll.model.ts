import { MealPollInterface } from '@interfaces'
import { Schema, model } from 'mongoose'

const mealPollSchema: Schema = new Schema(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: 'LunchBase',
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    },
    sent_at: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const mealPollModel = model<MealPollInterface & Document>(
  'MealPoll',
  mealPollSchema
)
