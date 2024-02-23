export interface LunchBaseCreateRequest {
  name: number
  org: number
}

export interface LunchBaseCreateResponse {
  _id: string
  name: string
  org: string
  is_active: boolean
  createdAt: string
}
