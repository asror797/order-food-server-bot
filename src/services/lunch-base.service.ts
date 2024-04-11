import { lunchBaseModel, lunchModel, orgModel } from '@models'
import { HttpException } from '@exceptions'
import {
  LunchBaseCreateRequest,
  LunchBaseRetrieveAllRequest,
  LunchBaseRetrieveAllResponse,
  LunchBaseRetrieveOneRequest,
  LunchBaseRetrieveOneResponse
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
  ): Promise<LunchBaseRetrieveOneResponse> {
    const lunchbase: any = await this.lunchbase
      .findById(payload.id)
      .populate('org', 'name_org')
      .select('name org is_active')
      .exec()

    if (!lunchbase) throw new HttpException(404, 'Lunchbase not found')

    return {
      _id: lunchbase['_id'],
      name: lunchbase.name,
      org: {
        _id: lunchbase.org['_id'],
        name_org: lunchbase.org.name_org
      },
      is_active: lunchbase.is_active
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
    const lunchbase = await this.lunchBaseRetrieveOne({ id: payload.id })
    const updateObj: any = {}

    if (payload.name) {
      await this.#_checkName({ name: payload.name, org: lunchbase.org['_id'] })
      updateObj.name = payload.name
    }

    if (payload.is_active) {
      updateObj.is_active = payload.is_active
    }

    if (payload.org) {
      const org = await this.orgs
        .findById(payload.org)
        .select('name_org')
        .exec()
      if (!org) throw new HttpException(404, 'Org not found')
      updateObj.org = payload.org
    }

    const newLunchbase = await this.lunchbase
      .findByIdAndUpdate(payload.id, updateObj, { new: true })
      .select('name org is_active')
      .exec()

    return newLunchbase
  }

  public async lunchBaseDelete(payload: { id: string }): Promise<any> {
    await this.lunchBaseRetrieveOne({ id: payload.id })
    const deletedLunchBase = await this.lunchbase.findByIdAndDelete(payload.id)

    return {
      _id: deletedLunchBase ? deletedLunchBase['_id'] : payload.id
    }
  }

  async #_checkName(payload: { name: string; org: string }) {
    const lunchbase = await this.lunchbase.findOne({
      name: payload.name,
      org: payload.org,
      is_active: true
    })
    if (lunchbase)
      throw new HttpException(400, 'Name of lunch-base already used')
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
