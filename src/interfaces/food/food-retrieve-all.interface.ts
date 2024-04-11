export interface FoodRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
  category?: string
  org?: string
  isDashboard?: boolean
}

export interface FoodList {
  _id: string
  name: string
  cost: number
  img: string
  org: string
  products?: number
  category?: string
  is_private?: boolean
}

export interface FoodRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  foodList: FoodList[]
}
