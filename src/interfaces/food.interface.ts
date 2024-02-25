import { Types } from 'mongoose'
import { IOrg } from './org.interface'

export enum CategoryEnum {
  DRINKS = 'drinks',
  SNAKCS = 'snacks',
  DESSERT = 'dessert'
}

export interface ProductWithAmount {
  product: Types.ObjectId
  amount: number
}

export interface IFood extends Document {
  is_active: boolean
  products: ProductWithAmount[]
  name: string
  cost: number
  img: string
  org: IOrg['_id']
  category: CategoryEnum
  is_deleted: boolean
}
