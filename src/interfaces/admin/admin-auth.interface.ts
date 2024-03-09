export interface AdminAuthRequest {
  phone_number: string
  password: string
}

export interface AdminAuthResponse {
  accessToken: string
  refreshToken: string
}
