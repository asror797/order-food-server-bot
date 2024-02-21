export interface WorkPlaceMenuRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface WorkPlaceMenuList {
  _id: string
  name: string
  cost: number
}

export interface WorkPlaceMenuRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  lunchList: WorkPlaceMenuList[]
}
