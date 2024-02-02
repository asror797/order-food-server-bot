import { Document } from 'mongoose'
import { IOrg } from './org.interface'

export enum Units {
  KILOGRAM = 'kilogram',
  LITR = 'litr',
  DONA = 'dona',
}

export interface IProduct extends Document {
  name: string
  amount: number
  cost: number
  org: IOrg['_id']
  unit: Units
}
