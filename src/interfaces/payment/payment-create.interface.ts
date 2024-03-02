export interface PaymentCreateRequest {
  type: boolean
  client: string
  org: string
  amount: number
}

export interface PaymentCreateResponse {
  type: boolean
  client: string
  org: string
  amount: number
}
