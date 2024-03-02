import { HttpException } from '@exceptions'
import {
  LunchBaseCreateRequest,
  LunchBaseRetrieveAllRequest,
  LunchBaseRetrieveAllResponse
} from '@interfaces'
import { lunchBaseModel, lunchModel, orgModel } from '@models'

export class LunchBaseService {
  readonly lunchbase = lunchBaseModel
  readonly orgs = orgModel
  public lunches = lunchModel

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

  public async lunchBaseRetrieveOne(): Promise<any> {}

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
    const lunchbase = await this.lunchBaseRetrieveOne()

    if (payload.name) {
      await this.#_checkName({ name: payload.name, org: lunchbase.org })
    }
  }

  public async lunchBaseDelete(): Promise<any> {}

  async #_checkName(payload: { name: string; org: string }) {
    const lunchbase = await this.lunchbase.find({
      name: payload.name,
      org: payload.org
    })
    console.log(payload, lunchbase)
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

  public async getByOrg(org: string) {
    const lunches = await this.lunchbase.find({
      org: org
    })

    return lunches
  }

  public async getById(lunch: string) {
    return await this.lunchbase.findById(lunch)
  }

  public async retrieveAllBasesByBase(id: string) {
    const lunches =
      (await this.lunchbase.find({
        where: {
          base: id,
          is_active: true
        }
      })) || []

    return lunches
  }

  public async retrieveLunches(id: string) {
    const lunches = await this.lunches.find({
      base: id
    })

    return lunches
  }

  public async retrieveLunchBase(id: string) {
    const base = await this.lunchbase.findById(id).select('name org createdAt')
    if (!base) throw new HttpException(400, 'lunch-base not found')
    return base
  }

  public async toggleStatus(payload: { id: string }) {
    const base = await this.lunchbase
      .findById(payload.id)
      .select('name is_active')
      .exec()

    if (!base) {
      throw new HttpException(400, 'not found base')
    }

    const updatedBase = await this.lunchbase.findByIdAndUpdate(
      payload.id,
      { is_active: !base.is_active },
      { new: true }
    )

    return updatedBase
  }
}
