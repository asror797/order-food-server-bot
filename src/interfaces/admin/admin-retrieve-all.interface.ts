export interface AdminRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface AdminList {
  _id: string
  fullname: string
  password: string
  org: string
  role: string
  phone_number: string
  createdAt: string
}

export interface AdminRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  adminList: AdminList[]
}
