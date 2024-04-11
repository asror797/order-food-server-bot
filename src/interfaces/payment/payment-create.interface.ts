import { ObjectId } from 'mongoose'

export interface PaymentCreateRequest {
  type: boolean
  client: string | ObjectId
  org: string
  amount: number
}

export interface PaymentCreateResponse {
  type: boolean
  client: string
  org: string
  amount: number
}
