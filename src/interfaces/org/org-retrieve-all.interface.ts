export interface OrgRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
  is_bot?: boolean
}

export interface OrgList {
  _id: string
  name_org: string
  group_a_id: number
  group_b_id: number
  trip_timeout: number
  is_active: boolean
}

export interface OrgRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  orgList: OrgList[]
}
