import redisService from './redis.service'
import { foodModel } from '@models'
import {
  FoodWithAmountStore,
  SaveToStoreByOrg,
  GetStoreByOrg
} from '@interfaces'

export class StoreService {
  private redisService = redisService
  private foods = foodModel

  public async editStep(payload: { telegramId: number; step: string }) {
    try {
      await this.redisService.setValue(
        `${payload.telegramId}/steps`,
        payload.step
      )
    } catch (error) {
      console.log(error)
    }
  }

  public async getStep(payload: { telegramId: number }) {
    try {
      const step = await this.redisService.getValue(
        `${payload.telegramId}/steps`
      )

      return step
    } catch (error) {
      console.log(error)
    }
  }

  public async getStoreByOrg(
    payload: GetStoreByOrg
  ): Promise<FoodWithAmountStore[]> {
    try {
      const store = await this.redisService.getValue(
        `${payload.chatId}/${payload.org}`
      )
      if (store == null) return []

      return JSON.parse(store)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async saveToStoreByOrg(payload: SaveToStoreByOrg) {
    try {
      console.log(payload)
      const Food = await this.foods
        .findById(payload.food)
        .select('name cost org')
        .exec()

      if (!Food || !Food.org) throw new Error('Food not found')
      if (!payload.chatId) throw new Error('Chat not found')

      const store: any = await this.getStoreByOrg({
        chatId: payload.chatId,
        org: Food.org.toString()
      })

      const stored = await this.redisService.setValue(
        `${payload.chatId}/${Food.org.toString()}`,
        JSON.stringify([
          ...store,
          {
            food: {
              id: Food['_id'].toString(),
              food: Food.name,
              cost: Food.cost
            },
            amount: payload.amount
          }
        ])
      )

      return stored
    } catch (error) {
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
}
