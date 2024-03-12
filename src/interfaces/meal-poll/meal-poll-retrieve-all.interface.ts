export interface MealPollRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
}

export interface MealPollList {
  _id: string
  meal: string
  org: string
  createdAt: string
}

export interface MealPollRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  mealpollList: MealPollList[]
}
