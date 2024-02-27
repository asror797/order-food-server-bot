export interface FoodStore {
  name: string
  cost: number
}

export interface FoodWithAmountStore {
  id: string
  food: FoodStore
  amount: number
}

export interface GetStoreByOrg {
  chatId: number
  org: string
}

export interface SaveToStoreByOrg {
  food: string
  amount: number
  chatId: number
}
