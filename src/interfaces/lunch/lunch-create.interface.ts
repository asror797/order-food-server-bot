export interface LunchProductsDefinition {
  product: string
  amount: number
}

export interface LunchCreateRequest {
  name: string
  cost: number
  base: string
  products: LunchProductsDefinition[]
  org: string
  persent_cook: number
}

export interface LunchCreateResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
}
