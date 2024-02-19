export interface FoodWithamountDefinition {
  food: string
  amount: string
}

export interface OrderRetrieveAllRequest {
  pageSize: number
  pageNumber: number
  org: string
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
