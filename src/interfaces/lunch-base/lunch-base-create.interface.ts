export interface LunchBaseCreateRequest {
  name: string
  org: string
}

export interface LunchBaseCreateResponse {
  _id: string
  name: string
  org: string
  is_active: boolean
  createdAt: string
}
