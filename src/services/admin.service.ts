import {
  AdminCreateRequest,
  AdminCreateResponse,
  AdminDeleteRequest,
  AdminDeleteResponse,
  AdminRetrieveAllRequest,
  AdminRetrieveAllResponse,
  AdminRetrieveOneRequest,
  AdminRetrieveOneResponse,
  AdminUpdateRequest,
  AdminUpdateResponse
} from '@interfaces'
import { adminModel, orgModel, roleModel } from '@models'
import { HttpException } from '@exceptions'

export class AdminService {
  public admins = adminModel
  public role = roleModel
  public org = orgModel

  public async adminRetrieveAll(
    payload: AdminRetrieveAllRequest
  ): Promise<AdminRetrieveAllResponse> {
    const adminList = await this.admins
      .find()
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .populate('org', 'name_org')
      .populate('role', 'title')
      .select('-updatedAt')
      .exec()

    const count = await this.admins.countDocuments().exec()

    return {
      count: count,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber,
      pageCount: 1,
      adminList: adminList.map((e) => ({
        _id: e['_id'],
        fullname: e.fullname,
        role: e.role?.title,
        phone_number: e.phone_number,
        org: e.org,
        password: '',
        createdAt: ''
      }))
    }
  }

  public async adminRetrieveOne(
    payload: AdminRetrieveOneRequest
  ): Promise<AdminRetrieveOneResponse> {
    const admin = await this.admins
      .findById(payload.id)
      .populate('org', 'name_org')
      .populate('role', 'title')
      .select('fullname phone_number createdAt updatedAt org role')
      .exec()

    if (!admin) throw new HttpException(404, 'User not found')

    return {
      _id: admin['_id'],
      fullname: admin.fullname,
      password: '',
      phone_number: admin.phone_number,
      org: admin.org,
      role: admin.role,
      createdAt: ''
    }
  }

  public async adminCreate(
    payload: AdminCreateRequest
  ): Promise<AdminCreateResponse> {
    const admin = await this.admins.create({
      fullname: payload.fullname,
      phone_number: payload.phone_number,
      org: payload.org,
      role: payload.role,
      password: payload.password
    })

    return {
      _id: admin['_id'],
      fullname: admin.fullname,
      password: '',
      phone_number: admin.phone_number,
      org: admin.org,
      role: admin.role,
      createdAt: ''
    }
  }

  public async adminUpdate(
    payload: AdminUpdateRequest
  ): Promise<AdminUpdateResponse> {
    const updateObj: Omit<AdminUpdateRequest, 'id'> = {}
    await this.adminRetrieveOne({ id: payload.id })
    if (payload.role) {
      const role = await this.role.findById(payload.role)
      if (!role) throw new HttpException(404, 'Role not found')
    }

    if (payload.org) {
      const org = await this.org.findById(payload.org)
      if (!org) throw new HttpException(404, 'Org not found')
    }

    const admin = await this.admins.findById(payload.id, updateObj).exec()

    if (!admin) throw new HttpException(500, ' Admin is not update')

    return {
      _id: admin['_id'],
      fullname: admin.fullname,
      password: '',
      phone_number: admin.phone_number,
      org: '',
      role: '',
      createdAt: ''
    }
  }

  public async adminDelete(
    payload: AdminDeleteRequest
  ): Promise<AdminDeleteResponse> {
    await this.adminRetrieveOne({ id: payload.id })
    const admin = await this.admins.findByIdAndDelete(payload.id)
    console.log(admin)
    return {
      _id: 'as'
    }
  }
}
