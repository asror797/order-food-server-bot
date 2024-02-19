export interface ProductRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  searh: string
}

export interface ProductList {
  _id: string
  name: string
  amount: number
  cost: number
  unit: string
}

export interface ProductRetrieveAllResponse {
  count: number
  pageSize: number
  pageNumber: number
  pageCount: number
  productList: ProductList[]
}
