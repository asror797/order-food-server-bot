export interface ProductCreateRequest {
  name: string
  org: string
  cost: number
  unit: string
}

export interface ProductCreateResponse {
  _id: string
  name: string
  cost: number
  amount: number
}
