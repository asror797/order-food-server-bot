export interface AdminRetrieveOneRequest {
  id: string
}

export interface AdminRetrieveOneResponse {
  _id: string
  fullname: string
  password: string
  org: string
  role: string
  phone_number: string
  createdAt: string
}
