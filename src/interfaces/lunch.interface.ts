import { Document } from 'mongoose'
import { IOrg } from './org.interface'

interface IProduct {
  product: string
  amount: number
}

export interface ILunch extends Document {
  org: IOrg['_id']
  name: string
  cost: number
  products: IProduct[]
  is_active: boolean
}
