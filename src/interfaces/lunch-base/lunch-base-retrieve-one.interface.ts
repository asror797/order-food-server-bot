export interface LunchBaseRetrieveOneRequest {
  id: string
}

export interface LunchBaseRetrieveOneResponse {
  _id: string
  name: string
  org: {
    _id: string
    name_org: string
  }
  is_active: boolean
}
