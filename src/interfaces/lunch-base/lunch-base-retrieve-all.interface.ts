export interface LunchBaseRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
  org?: string
}

export interface LunchBaseList {
  _id: string
  name: string
  cost: number
  is_active: boolean
}

export interface LunchBaseRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  lunchList: LunchBaseList[]
}
