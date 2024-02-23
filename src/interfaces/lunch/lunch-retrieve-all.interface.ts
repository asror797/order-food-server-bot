export interface LunchRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface LunchList {
  _id: string
  name: string
  cost: number
  base: string
  percent_cook: number
}

export interface LunchRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  lunchList: LunchList[]
}
