import { PollVoteInterface } from '@interfaces'
import { Document, Schema, model } from 'mongoose'

const pollVoteSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    meal_poll: {
      type: Schema.Types.ObjectId,
      ref: 'MealPoll',
      required: true
    },
    meal: {
      type: Schema.Types.ObjectId,
      ref: 'Lunch',
      required: true
    },
    cost: {
      type: Number,
      requird: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const pollVote = model<PollVoteInterface & Document>(
  'PollVote',
  pollVoteSchema
)
