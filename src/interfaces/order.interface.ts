import { Document } from 'mongoose'
import { IOrg } from './org.interface'

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
  org: IOrg['_id']
}
