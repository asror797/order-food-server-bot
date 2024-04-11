import { Document, ObjectId } from 'mongoose'

export interface FoodWithAmount {
  food: string
  amount: string
}

export interface IOrder extends Document {
  foods: FoodWithAmount[]
  total_cost: number
  client: string
  is_canceled: boolean
  is_accepted: boolean
  org: ObjectId
}
