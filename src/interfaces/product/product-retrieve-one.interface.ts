export interface ProductRetrieveOneRequest {
  id: string
}

export interface ProductRetrieveOneResponse {
  _id: string
  name: string
  cost: number
  amount: number
}
