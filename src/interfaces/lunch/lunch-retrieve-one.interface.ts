import { LunchProductsDefinition } from './lunch-create.interface'

export interface LunchRetrieveOneRequest {
  pageSize: number
  pageNumber: number
  search: string
}

export interface LunchRetrieveOneResponse {
  _id: string
  cost: number
  base: string
  products: LunchProductsDefinition[]
  org: string
  percent_cook: string
}
