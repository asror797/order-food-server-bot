export interface LunchBaseRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface LunchBaseList {
  _id: string
  name: string
  cost: number
}

export interface LunchBaseRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  lunchList: LunchBaseList[]
}
