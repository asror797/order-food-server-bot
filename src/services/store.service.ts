import { foodModel } from '@models'
import redisService from './redis.service'

interface Food {
  name: string
  cost: number
}

interface FoodWithAmount {
  id: string
  food: Food
  amount: number
}

export class StoreService {
  private redisService = redisService
  private foods = foodModel

  public async getStore(id: string) {
    try {
      const store = await this.redisService.getValue(id)
      if (store == null) {
        return []
      } else {
        return JSON.parse(store)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async saveToStore(id: string, food: string, amount: string) {
    try {
      const Food = await this.foods.findById(food)
      if (!Food) throw new Error('not found food')
      console.log(Food)
      const store: FoodWithAmount[] = await this.getStore(id)
      const stored = await this.redisService.setValue(
        id,
        JSON.stringify([
          ...store,
          {
            food: {
              id: Food['_id'],
              food: Food.name,
              cost: Food.cost,
            },
            amount: amount,
          },
        ]),
      )

      console.log(stored)

      return stored
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async clear(id: number) {
    try {
      const response = await this.redisService.setValue(
        `${id}`,
        JSON.stringify([]),
      )
      console.log(response)

      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
