export interface FoodRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
  category?: string
  org?: string
}

export interface FoodList {
  _id: string
  name: string
  cost: number
  img: string
}

export interface FoodRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  foodList: FoodList[]
}
