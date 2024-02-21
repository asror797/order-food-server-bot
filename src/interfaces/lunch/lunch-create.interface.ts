export interface LunchCreateRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface LunchCreateResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
}
