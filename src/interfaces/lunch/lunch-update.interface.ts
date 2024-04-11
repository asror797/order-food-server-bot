import { LunchProductsDefinition } from './lunch-create.interface'

export interface LunchUpdateRequest {
  id: string
  name?: string
  cost?: number
  persent_cook?: string
  is_active?: boolean
}

export interface LunchUpdateResponse {
  id: string
  name: string
  cost: number
  base: string
  products: LunchProductsDefinition[]
  org: string
  persent_cook: number
}
