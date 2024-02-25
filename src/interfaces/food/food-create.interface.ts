import { ObjectId } from 'mongoose'

export interface FoodProductsDefinition {
  product: string | ObjectId
  amount: number
}

export interface FoodCreateRequest {
  name: string
  cost: number
  img?: string
  org: string
  category: string
  products: FoodProductsDefinition[]
}

export interface FoodCreateResponse {
  _id: string
  cost: number
  name: string
}
