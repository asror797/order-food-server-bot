export interface AdminRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface AdminList {
  _id: string
  name: string
  cost: number
}

export interface AdminRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  lunchList: AdminList[]
}
