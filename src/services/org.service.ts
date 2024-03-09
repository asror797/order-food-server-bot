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
import { Update, UpdateGroupDto } from '../dtos/org.dto'

export class OrgService {
  private orgs = orgModel

  public async orgRetrieveAll(
    payload: OrgRetrieveAllRequest
  ): Promise<OrgRetrieveAllResponse> {
    const query: any = {}

    if(payload.is_bot) {
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

  public async orgCreate(payload: OrgCreateRequest): Promise<any> {
    const org = await this.orgs.create({
      name_org: payload.name_org,
      group_a_id: payload.group_a_id,
      group_b_id: payload.group_b_id
    })

    return org
  }

  public async orgUpdate(payload: OrgUpdateRequest): Promise<any> {
    const updateObj: any = {}
    const updatedOrg = await this.orgs.findByIdAndUpdate(payload.id, updateObj)

    return updatedOrg
  }

  public async orgDelete(payload: OrgDeleteRequest): Promise<any> {
    console.log(payload)
  }

  public async get(page: number, size: number) {
    const skip = (page - 1) * size

    const org = await this.orgs
      .find()
      .select('-updatedAt')
      .skip(skip)
      .limit(size)
      .exec()
    const totalOrgs = await this.orgs.countDocuments().exec()
    const totalPages = Math.ceil(totalOrgs / size)
    return {
      data: org,
      currentPage: page,
      totalPages,
      totalOrgs,
      orgsOnPage: org.length
    }
  }

  public async createOrg(name: string) {
    const newOrg = await this.orgs.create({
      name_org: name
    })

    return newOrg
  }

  public async update(payload: Update) {
    const { org, group_a_id, group_b_id, trip_timeout } = payload

    const Org = await this.orgs.findById(org)
    if (!Org) throw new HttpException(400, 'org not found')
    const updateData: Omit<Update, 'org'> = {}

    if (group_a_id) updateData.group_a_id = group_a_id
    if (group_b_id) updateData.group_b_id = group_b_id
    if (trip_timeout) updateData.trip_timeout = trip_timeout

    const updatedOrg = await this.orgs
      .findByIdAndUpdate(org, updateData, { new: true })
      .exec()

    if (!updatedOrg)
      throw new HttpException(500, 'something went wrong try again')

    return updatedOrg
  }

  public async updateOrg(payload: any) {
    const { org, time } = payload

    if (typeof time !== 'number')
      throw new HttpException(400, 'time should be number')

    const isExist = await this.orgs.findById(org)
    if (isExist) throw new HttpException(400, 'not found org')
    console.log('simple')

    const updatedOrg = await this.orgs.findByIdAndUpdate(
      org,
      {
        trip_timeout: Number(time)
      },
      { new: true }
    )

    console.log(updatedOrg)
    return updatedOrg
  }

  public async updateGroupId(orgData: UpdateGroupDto) {
    const { org, group_a_id, group_b_id } = orgData
    const Org = await this.orgs.findById(org)
    if (!Org) throw new HttpException(400, 'not found org')
    delete orgData.org
    const newOrgField: any = {}

    if (group_a_id) {
      newOrgField.group_a_id = Number(group_a_id)
    }

    if (group_b_id) {
      newOrgField.group_b_id = Number(group_b_id)
    }
    const updatedGroup = await this.orgs.findByIdAndUpdate(org, newOrgField, {
      new: true
    })
    console.log(updatedGroup)
    return updatedGroup
  }
}
