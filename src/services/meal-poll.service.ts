import {
  MealPollCreateRequest,
  MealPollDeleteRequest,
  MealPollRetrieveAllRequest,
  MealPollRetrieveAllResponse,
  MealPollRetrieveOneRequest,
  MealPollUpdateRequest
} from '@interfaces'
import { mealPollModel } from '@models'

export class mealPollService {
  private mealpolls = mealPollModel

  public async mealPollRetrieveAll(
    payload: MealPollRetrieveAllRequest
  ): Promise<MealPollRetrieveAllResponse> {
    const mealpollList = await this.mealpolls
      .find()
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .exec()

    console.log(mealpollList)
    return {
      count: 0,
      pageNumber: 5,
      pageSize: 5,
      pageCount: 5,
      lunchList: []
    }
  }

  public async mealPollRetrieveOne(
    payload: MealPollRetrieveOneRequest
  ): Promise<any> {
    const mealpoll = await this.mealpolls.findById(payload.search)

    return mealpoll
  }

  public async mealPollCreate(payload: MealPollCreateRequest): Promise<any> {
    console.log(payload)
  }

  public async mealPollUpdate(payload: MealPollUpdateRequest): Promise<any> {
    console.log(payload)
  }

  public async mealPollDelete(payload: MealPollDeleteRequest): Promise<any> {
    console.log(payload)
  }
}
