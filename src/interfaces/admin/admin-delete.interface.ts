export interface AdminDeleteRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface AdminDeleteResponse {
  id: string
}
