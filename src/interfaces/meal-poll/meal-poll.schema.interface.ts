import { Document } from 'mongoose'

export interface MealPollInterface extends Document {
  meal: string
  org: string
  sent_at: number
}
