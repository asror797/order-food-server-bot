export interface FoodWithamountDefinition {
  food: string
  amount: number
}

export interface OrderRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  search?: string
}

export interface OrderList {
  foods: FoodWithamountDefinition[]
  org: string
}

export interface OrderRetrieveAllResponse {
  count: number
  pageSize: number
  pageNumber: number
  pageCount: number
  orderList: OrderList[]
}
