export interface AdminCreateRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface AdminCreateResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
}
