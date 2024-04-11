export interface MealPollCreateRequest {
  meal: string
  org: string
}

export interface MealPollLunchbaseDefinition {
  _id: string
  name: string
}

export interface MealPollOrgDefinition {
  _id: string
  trip_timeout: number
  name_org: string
}

export interface MealPollCreateDefinition {
  _id?: string
  meal?: MealPollLunchbaseDefinition
  org?: MealPollOrgDefinition
  sent_at?: number
  createdAt?: string
  diffrence?: number
}

export interface MealPollCreateResponse {
  status: boolean
  data: MealPollCreateDefinition
}
