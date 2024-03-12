export interface AdminCreateRequest {
  fullname: string
  password: string
  org: string
  role: string
  phone_number: string
}

export interface AdminCreateResponse {
  _id: string
  fullname: string
  password: string
  org: string
  role: string
  phone_number: string
}
