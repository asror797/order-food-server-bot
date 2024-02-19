import { Update, UpdateGroupDto } from '../dtos/org.dto'
import { HttpException } from '../exceptions/httpException'
import { orgModel } from '@models'

export class OrgService {
  private orgs = orgModel

  public async orgRetrieveAll(): Promise<any> {}
  public async orgRetrieveOne(): Promise<any> {}
  public async orgCreate(): Promise<any> {}
  public async orgUpdate(): Promise<any> {}
  public async orgDelete(): Promise<any> {}

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
