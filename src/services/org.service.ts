import {
  OrgCreateRequest,
  OrgDeleteRequest,
  OrgRetrieveAllRequest,
  OrgRetrieveAllResponse,
  OrgRetrieveOneResponse,
  OrgUpdateRequest
} from '@interfaces'
import { orgModel } from '@models'
import { HttpException } from '@exceptions'
import { ValidationService } from '@services'
import { OrgCreateDto, OrgUpdateDto } from '@dtos'

export class OrgService {
  private orgs = orgModel
  private validationService = new ValidationService()

  public async orgRetrieveAll(
    payload: OrgRetrieveAllRequest
  ): Promise<OrgRetrieveAllResponse> {
    const query: any = {}

    if (payload.is_bot) {
      query.is_active = true
    }

    if (payload.search) {
      query.name_org = { $regex: payload.search, $options: 'i' }
    }

    const orgList = await this.orgs
      .find(query)
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .select('-createdAt -updatedAt')
      .exec()

    const count = await this.orgs.countDocuments(query)

    return {
      count: count,
      pageNumber: payload.pageNumber,
      pageCount: Math.ceil(count / payload.pageSize),
      pageSize: payload.pageSize,
      orgList: orgList.map((e) => ({
        _id: e['_id'],
        name_org: e.name_org,
        group_a_id: e.group_a_id,
        group_b_id: e.group_b_id,
        is_active: e.is_active,
        trip_timeout: e.trip_timeout
      }))
    }
  }

  public async orgRetrieveOne(payload: {
    id: string
  }): Promise<OrgRetrieveOneResponse> {
    if (!payload.id) throw new HttpException(400, 'Id is required')
    const org = await this.orgs
      .findById(payload.id)
      .select('name_org group_a_id group_b_id')
      .exec()

    if (!org) throw new HttpException(404, 'Org not found')

    return {
      _id: org['_id'],
      name_org: org.name_org,
      group_a_id: org.group_a_id,
      group_b_id: org.group_b_id
    }
  }

  public async orgCreate(payload: OrgCreateDto): Promise<any> {
    await this.validationService.validateDto(payload)

    const org = await this.orgs.create({
      name_org: payload.name_org,
      group_a_id: payload.group_a_id,
      group_b_id: payload.group_b_id,
      trip_timeout: payload.trip_timeout
    })

    return org
  }

  public async orgUpdate(payload: OrgUpdateRequest): Promise<any> {
    await this.orgRetrieveOne({ id: payload.id })
    const updateObj: any = {}

    if (payload.group_a_id) {
      updateObj.group_a_id = payload.group_a_id
    }

    if (payload.group_b_id) {
      updateObj.group_b_id = payload.group_b_id
    }

    if (payload.name_org) {
      updateObj.name_org = payload.name_org
    }

    const updatedOrg = await this.orgs
      .findByIdAndUpdate(payload.id, updateObj, { new: true })
      .select('name_org is_active group_a_id group_b_id trip_timeout')
      .exec()

    return updatedOrg
  }

  public async orgDelete(payload: OrgDeleteRequest): Promise<any> {
    if (!payload.id) throw new HttpException(400, 'Id required')
    await this.orgRetrieveOne({ id: payload.id })

    const org = await this.orgs.findByIdAndDelete(payload.id)
    return {
      _id: org ? org['_id'] : payload.id
    }
  }
}
