import { Document } from 'mongoose'

export interface ILunchBase extends Document {
  name: string
  org: string
  is_active: boolean
}
