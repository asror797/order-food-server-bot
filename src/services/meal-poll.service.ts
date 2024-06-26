import { HttpException } from '@exceptions'
import {
  MealPollCreateRequest,
  MealPollCreateResponse,
  MealPollDeleteRequest,
  MealPollRetrieveAllRequest,
  MealPollRetrieveAllResponse,
  MealPollRetrieveOneRequest,
  MealPollUpdateRequest
} from '@interfaces'
import { lunchBaseModel, mealPollModel, orgModel } from '@models'

export class MealPollService {
  private orgs = orgModel
  private mealpolls = mealPollModel
  private lunchbase = lunchBaseModel

  public async mealPollRetrieveAll(
    payload: MealPollRetrieveAllRequest
  ): Promise<MealPollRetrieveAllResponse> {
    const mealpollList = await this.mealpolls
      .find()
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .sort({ createdAt: -1 })
      .exec()

    return {
      count: 0,
      pageNumber: 5,
      pageSize: 5,
      pageCount: 5,
      mealpollList: mealpollList.map((e) => ({
        _id: '',
        org: '',
        meal: '',
        createdAt: ''
      }))
    }
  }

  public async mealPollRetrieveOne(
    payload: MealPollRetrieveOneRequest
  ): Promise<any> {
    const mealpoll = await this.mealpolls.findById(payload.search)

    return mealpoll
  }

  public async mealPollCreate(
    payload: MealPollCreateRequest
  ): Promise<MealPollCreateResponse> {
    const org = await this.orgs
      .findById(payload.org)
      .select('trip_timeout name_org')
      .exec()

    if (!org) throw new HttpException(404, 'Org not found')

    const lunchbase = await this.lunchbase
      .findById(payload.meal)
      .select('name')
      .exec()

    if (!lunchbase) throw new HttpException(404, 'Meal not found')

    const getLatestMealPoll = await this.mealpolls
      .findOne({
        org: payload.org
      })
      .sort({ createdAt: -1 })
      .select('sent_at')
      .exec()

    if (getLatestMealPoll) {
      const diffrence =
        (Math.floor(Date.now() / 1000) - getLatestMealPoll.sent_at) / 60

      if (diffrence > org.trip_timeout) {
        const newmealpoll = await this.mealpolls.create({
          sent_at: Math.floor(Date.now() / 1000),
          meal: payload.meal,
          org: payload.org
        })

        return {
          status: true,
          data: {
            ...newmealpoll.toObject(),
            meal: lunchbase,
            org: org
          }
        }
      } else {
        return {
          status: false,
          data: {
            diffrence: org.trip_timeout - diffrence
          }
        }
      }
    } else {
      const newmealpoll = await this.mealpolls.create({
        sent_at: Math.floor(Date.now() / 1000),
        meal: payload.meal,
        org: payload.org
      })

      return {
        status: true,
        data: {
          ...newmealpoll.toObject(),
          meal: lunchbase,
          org: org
        }
      }
    }
  }

  public async mealPollUpdate(payload: MealPollUpdateRequest): Promise<any> {
    console.log(payload)
  }

  public async mealPollDelete(payload: MealPollDeleteRequest): Promise<any> {
    console.log(payload)
  }
}
