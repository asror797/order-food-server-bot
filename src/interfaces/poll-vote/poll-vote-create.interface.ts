import { ObjectId } from 'mongoose'

export interface PollVoteCreateRequest {
  user: string | ObjectId
  meal_poll: string | ObjectId
  meal: string | ObjectId
}

export interface PollVoteCreateResponse {
  status: boolean
  user: string | ObjectId
  meal_poll: string | ObjectId
  meal: string | ObjectId
  cost: number
  org: any
  timeout?: boolean
}
