export interface ProductUpdateRequest {
  id: string
  org?: string
  name?: string
  cost?: number
  unit?: string
  min_amount?: number
}

export interface ProductChangeAmountRequest {
  id: string
  type: boolean
  amount: number
}

export interface ProductUpdateResponse {
  _id: string
}
