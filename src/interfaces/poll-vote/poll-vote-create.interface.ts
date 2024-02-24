import { ObjectId } from 'mongoose'

export interface PollVoteCreateRequest {
  user: string | ObjectId
  meal_poll: string | ObjectId
  meal: string | ObjectId
  cost: number
}

export interface PollVoteCreateResponse {
  user: string | ObjectId
  meal_poll: string | ObjectId
  meal: string | ObjectId
  cost: number
}
