export interface ProductRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
}

export interface ProductList {
  _id: string
  name: string
  amount: number
  cost: number
  org: string
  unit: string
}

export interface ProductRetrieveAllResponse {
  count: number
  pageSize: number
  pageNumber: number
  pageCount: number
  productList: ProductList[]
}
