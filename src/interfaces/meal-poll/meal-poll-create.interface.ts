export interface MealPollCreateRequest {
  meal: string
  org: string
  sent_at: number
}

export interface MealPollCreateResponse {
  _id: string
  meal: string
  org: string
  sent_at: number
  createdAt: string
}
