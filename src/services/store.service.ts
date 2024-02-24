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

interface GetStoreByOrg {
  chatId: number
  org: string
}

interface SaveToStoreByOrg {
  org: string
  food: string
  amount: number
  chatId: number
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

  public async getStoreByOrg(payload: GetStoreByOrg) {
    try {
      const store = await this.redisService.getValue(
        `${payload.chatId}/${payload.org}`
      )
      console.log(`${payload.chatId}/${payload.org}`)
      if (store == null) {
        return []
      } else {
        return JSON.parse(store)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async saveToStoreByOrg(payload: SaveToStoreByOrg) {
    try {
      const Food = await this.foods.findById(payload.food)
      if (!Food) throw new Error('not found food')
      const store: any = await this.getStoreByOrg({
        chatId: payload.chatId,
        org: payload.org
      })
      console.log(`${payload.chatId}/${payload.org}`, payload.org)
      console.log(payload, 'payload')
      const stored = await this.redisService.setValue(
        `${payload.chatId}/${payload.org}`,
        JSON.stringify([
          ...store,
          {
            food: {
              id: payload.food,
              food: Food.name,
              cost: Food.cost
            },
            amount: payload.amount
          }
        ])
      )

      return stored
    } catch (error) {
      console.log(error)
    }
  }

  public async saveToStore(id: string, food: string, amount: string) {
    try {
      const Food = await this.foods.findById(food)
      if (!Food) throw new Error('not found food')
      const store: FoodWithAmount[] = await this.getStore(id)
      const stored = await this.redisService.setValue(
        id,
        JSON.stringify([
          ...store,
          {
            food: {
              id: Food['_id'],
              food: Food.name,
              cost: Food.cost
            },
            amount: amount
          }
        ])
      )

      console.log(stored)

      return stored
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async clearStoreByOrg(payload: { chat: number; org: string }) {
    try {
      const response = await this.redisService.setValue(
        `${payload.chat}/${payload.org}`,
        JSON.stringify([])
      )
      return response
    } catch (error) {
      throw error
    }
  }

  public async clear(id: number) {
    try {
      const response = await this.redisService.setValue(
        id.toString(),
        JSON.stringify([])
      )
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
