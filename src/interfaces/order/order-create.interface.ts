import { ObjectId } from 'mongoose'
import { FoodWithamountDefinition } from './order-retrieve-all.interface'

export interface OrderCreateRequest {
  foods: FoodWithamountDefinition[]
  client: string | ObjectId
  org: string
}

export interface OrderCreateUserDefinition {
  fullname: string
  phone_number: string
}

export interface OrderCreateResponse {
  _id: string
  foods: FoodWithamountDefinition[]
  total_cost: number
  user: OrderCreateUserDefinition
  is_canceled: boolean
  is_accepted: boolean
  org: string
  createdAt: string
}
