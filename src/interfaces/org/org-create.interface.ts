export interface OrgCreateRequest {
  name_org: string
  group_a_id: number
  group_b_id: number
}

export interface OrgCreateResponse {
  _id: string
  name: string
  group_a_id: number
  group_b_id: number
}
