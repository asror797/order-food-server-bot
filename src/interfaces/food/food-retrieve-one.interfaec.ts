export interface FoodRetrieveOneRequest {
  id: string
  org?: string
}

export interface FoodRetrieveOneResponse {
  _id: string
  name: string
  cost: number
  img: string
  org: string
}
