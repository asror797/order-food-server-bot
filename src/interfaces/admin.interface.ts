import { Document } from 'mongoose'
import { IRole } from './role.interface'

export interface IAdmin extends Document {
  fullname: string
  password: string
  org: string
  role: IRole['_id']
  phone_number: string
}
