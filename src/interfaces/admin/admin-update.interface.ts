import { ObjectId } from 'mongoose'

export interface AdminUpdateRequest {
  id: string
  fullname?: string
  password?: string
  org?: string
  role?: string
  phone_number?: string
}

export interface AdminUpdateResponse {
  _id: string | ObjectId
  fullname: string
  password: string
  org: string
  role: string
  phone_number: string
}
