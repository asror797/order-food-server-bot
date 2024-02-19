export interface ProductCreateRequest {
  name: string
  org: string
}

export interface ProductCreateResponse {
  _id: string
  name: string
  cost: number
  amount: number
}
