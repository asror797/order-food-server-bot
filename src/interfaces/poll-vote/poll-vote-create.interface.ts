export interface WorkPlaceMenuCreateRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface WorkPlaceMenuCreateResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
}
