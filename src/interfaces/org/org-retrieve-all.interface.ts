export interface OrgRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface OrgList {
  _id: string
  name: string
  cost: number
}

export interface OrgRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  foodList: OrgList[]
}
