import { Document } from 'mongoose'

export interface PollVoteInterface extends Document {
  user: string
  meal_poll: string
  meal: string
  cost: number
}
