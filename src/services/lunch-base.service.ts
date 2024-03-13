import { lunchBaseModel, lunchModel, orgModel } from '@models'
import { HttpException } from '@exceptions'
import {
  LunchBaseCreateRequest,
  LunchBaseRetrieveAllRequest,
  LunchBaseRetrieveAllResponse,
  LunchBaseRetrieveOneRequest
} from '@interfaces'

export class LunchBaseService {
  private orgs = orgModel
  private lunches = lunchModel
  private lunchbase = lunchBaseModel

  public async lunchBaseRetrieveAll(
    payload: LunchBaseRetrieveAllRequest
  ): Promise<LunchBaseRetrieveAllResponse> {
    console.log(payload)

    return {
      count: 11,
      lunchList: [],
      pageCount: 1,
      pageNumber: 1,
      pageSize: 4
    }
  }

  public async lunchBaseRetrieveOne(
    payload: LunchBaseRetrieveOneRequest
  ): Promise<any> {
    const lunch = await this.lunches
      .findById(payload.id)
      .select('name cost unit')
    return {
      ...lunch
    }
  }

  public async lunchBaseCreate(payload: LunchBaseCreateRequest): Promise<any> {
    const org = await this.orgs.findById(payload.org)
    if (!org) throw new HttpException(404, 'Org not found')

    await this.#_checkName({ name: payload.name, org: payload.org })

    const lunchbase = await this.lunchbase.create({
      name: payload.name,
      org: payload.org
    })

    return lunchbase
  }

  public async lunchBaseUpdate(payload: any): Promise<any> {
    await this.lunchBaseRetrieveOne({ id: payload.id })

    // if (payload.name) {
    //   await this.#_checkName({ name: payload.name, org: lunchbase.org })
    // }

    // return lunchbase
  }

  public async lunchBaseDelete(): Promise<any> {}

  async #_checkName(payload: { name: string; org: string }) {
    const lunchbase = await this.lunchbase.find({
      name: payload.name,
      org: payload.org
    })
    if (!lunchbase) throw new HttpException(400, 'Already name used')
  }

  async retrieveAllLunchBases(payload: any) {
    const skip = (payload.page - 1) * payload.size

    const query: any = {}

    if (payload.search) {
      query.$or = [{ name: { $regex: payload.search, $options: 'i' } }]
    }

    const org = await this.lunchbase
      .find(query)
      .select('-updatedAt')
      .skip(skip)
      .limit(payload.size)
      .sort({ createdAt: -1 })
      .populate('org', 'name_org')
      .exec()

    const totalLunchBases = await this.lunchbase.countDocuments().exec()
    const totalPages = Math.ceil(totalLunchBases / payload.size)
    return {
      data: org,
      currentPage: payload.page,
      totalPages,
      totalLunchBases,
      lunchBasesOnPage: org.length
    }
  }

  public async toggleStatus(payload: { id: string }) {
    const base = await this.lunchbase
      .findById(payload.id)
      .select('name is_active')
      .exec()

    if (!base) {
      throw new HttpException(400, 'Base not found')
    }

    const updatedBase = await this.lunchbase.findByIdAndUpdate(
      payload.id,
      { is_active: !base.is_active },
      { new: true }
    )

    return updatedBase
  }
}
