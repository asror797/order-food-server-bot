export interface LunchBaseCreateRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface LunchBaseCreateResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
}
