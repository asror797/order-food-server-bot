import { Document } from 'mongoose'

export enum UserRole {
  ADMIN = 'admin',
  COOK = 'cook',
  USER = 'user'
}

export interface IUser extends Document {
  first_name: string
  last_name: string
  phone_number: string
  is_active: boolean
  is_verified: boolean
  telegram_id: number
  language_code: string
  role: UserRole
  org: string
  balance: number
}
