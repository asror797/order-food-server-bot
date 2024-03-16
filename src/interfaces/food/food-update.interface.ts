export interface FoodUpdateRequest {
  id: string
  cost?: number
  img?: string
  name?: string
  org?: string
  category?: string
  is_deleted?: boolean
}

export interface FoodUpdateResponse {
  _id: string
  name: string
  cost: number
  img: string
  org: string
  category: string
  is_private: boolean
}
