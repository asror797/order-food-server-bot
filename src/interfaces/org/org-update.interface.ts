export interface OrgUpdateRequest {
  id: string
  name_org?: string
  group_a_id?: number
  group_b_id?: number
  is_active?: boolean
}

export interface OrgUpdateResponse {
  _id: string
}
