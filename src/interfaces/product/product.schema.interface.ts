import { Document } from 'mongoose'

export enum Units {
  KILOGRAM = 'kilogram',
  LITR = 'litr',
  DONA = 'dona'
}

export interface IProduct extends Document {
  name: string
  amount: number
  cost: number
  org: string
  unit: Units
}
