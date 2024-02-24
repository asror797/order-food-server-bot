import { ObjectId } from 'mongoose'

export interface OrgRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
}

export interface OrgList {
  _id: string | ObjectId
  name_org: string
  group_a_id: number
  group_b_id: number
}

export interface OrgRetrieveAllResponse {
  count: number
  pageSize: number
  pageCount: number
  pageNumber: number
  orgList: OrgList[]
}
