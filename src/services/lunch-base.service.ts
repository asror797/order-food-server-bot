import {
  CreateLunchBaseDto,
  GetLunchBaseDto,
  UpdateLunchBaseDto,
} from '../dtos/lunch-base.dto'
import { HttpException } from '@exceptions'
import { lunchBaseModel, lunchModel, orgModel } from '@models'

export class LunchBaseService {
  readonly lunchbase = lunchBaseModel
  readonly orgs = orgModel
  public lunches = lunchModel

  async retrieveAllLunchBases(payload: GetLunchBaseDto) {
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
      lunchBasesOnPage: org.length,
    }
  }

  public async getByOrg(org: string) {
    const lunches = await this.lunchbase.find({
      org: org,
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
        },
      })) || []

    return lunches
  }

  public async retrieveLunches(id: string) {
    const lunches = await this.lunches.find({
      base: id,
    })

    return lunches
  }

  public async retrieveLunchBase(id: string) {
    const base = await this.lunchbase.findById(id).select('name org createdAt')
    if (!base) throw new HttpException(400, 'lunch-base not found')
    return base
  }

  async createLunchBase(payload: CreateLunchBaseDto) {
    const Org = await this.orgs.findById({
      _id: payload.org,
    })

    if (!Org) throw new HttpException(400, 'org not found')

    const createdBase = await this.lunchbase.create({
      name: payload.name,
      org: payload.org,
    })

    return createdBase
  }

  async updateLunchBase(payload: UpdateLunchBaseDto) {
    await this.retrieveLunchBase(payload.id)
    const updateField: any = {}

    if (payload.name) {
      updateField.name = payload.name
    }
    if (payload.org) {
      const Org = await this.orgs.findById({
        _id: payload.org,
      })

      if (!Org) throw new HttpException(400, 'org not found')

      updateField.Org = payload.org
    }

    const updatedAtBase = await this.lunchbase.findByIdAndUpdate(
      payload.id,
      updateField,
      { new: true },
    )
    return updatedAtBase
  }
}
