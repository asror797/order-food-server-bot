import { Document } from 'mongoose'

export interface IProductLog extends Document {
  amount: number
  type: boolean
  product: string
  org: string
}
