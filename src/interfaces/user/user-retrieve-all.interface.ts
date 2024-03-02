import { ObjectId } from 'mongoose'

export interface UserRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
}

export interface UserList {
  _id: string | ObjectId
  first_name: string
  last_name: string
  phone_number: string
  is_active: boolean
  is_verified: boolean
  telegram_id: number
  language_code: string
  balance: number
  role: string
  org?: any
}

export interface ActiveUserList {
  _id: string | ObjectId
  telegram_id: number
}

export interface UserRetrieveAllResponse {
  count: number
  pageSize: number
  pageNumber: number
  pageCount: number
  userList: UserList[]
}
