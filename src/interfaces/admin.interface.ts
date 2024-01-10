import { Document } from 'mongoose'

export interface IAdmin extends Document {
  fullname: string
  password: string
  org: string
  role: string[]
  phone_number: string
}
