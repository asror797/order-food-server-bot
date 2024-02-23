import { LunchProductsDefinition } from './lunch-create.interface'

export interface LunchUpdateRequest {
  id: string
  name?: string
  cost?: number
  base?: string
  products?: LunchProductsDefinition[]
  org?: string
  persent_cook?: number
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
