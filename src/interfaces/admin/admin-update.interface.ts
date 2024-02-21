export interface AdminUpdateRequest {
  id: string
  fullname?: string
  password?: string
  org?: string
  role?: string
  phone_number?: string
}

export interface AdminUpdateResponse {
  _id: string
  fullname: string
  password: string
  org: string
  role: string
  phone_number: string
  createdAt: string
}
