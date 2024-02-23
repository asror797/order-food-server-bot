import { Document, ObjectId } from 'mongoose'

interface IProduct {
  product: string
  amount: number
}

export interface ILunch extends Document {
  org: string | ObjectId
  name: string
  cost: number
  products: IProduct[]
  is_active: boolean
}
