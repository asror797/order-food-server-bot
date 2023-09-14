import foodModel from "../models/food.model";
import redisService from "./redis.service";


interface FoodWithAmount {
  food: string
  amount: number
}


class StoreService {
  private redisService = redisService
  private foods = foodModel;

  public async getStore(id: string) {
    try {
      const store = await this.redisService.getValue(id);
      if(store == null ) {
        return []
      } else {
        return JSON.parse(store)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async saveToStore(id: string, food: string,amount: string) {
    try {
      const Food = await this.foods.findById(food);
      // if(!Food) 
      const store: FoodWithAmount[] = await this.getStore(id);
      const stored = await this.redisService.setValue(id,JSON.stringify([
        ...store,
        {
          food: food,
          amount: amount
        }
      ]));

      console.log(stored)

      return stored;

    } catch (error) {
      
    }
  }

  public async clear() {

  }
}


export default StoreService;