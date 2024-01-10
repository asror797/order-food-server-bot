import { Document } from 'mongoose'

export interface IPayment extends Document {
  client: string
  org: string
  amount: number
  type: boolean
}
