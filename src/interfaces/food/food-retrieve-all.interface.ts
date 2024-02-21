export interface FoodRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface FoodList {
  _id: string
  name: string
  cost: number
}

export interface FoodRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  foodList: FoodList[]
}
