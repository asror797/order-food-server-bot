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
import { hash, compare } from 'bcrypt'
import { validationServiceInstance } from '@services'
import { AdminCreateDto } from '@dtos'
import { id } from 'date-fns/locale'

export class AdminService {
  private admins = adminModel
  private role = roleModel
  private org = orgModel

  public async adminRetrieveAll(
    payload: AdminRetrieveAllRequest
  ): Promise<AdminRetrieveAllResponse> {
    const adminList = await this.admins
      .find()
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .populate('org', 'name_org')
      .populate('role', 'title')
      .select('fullname phone_number password createdAt')
      .exec()

    const count = await this.admins.countDocuments().exec()

    return {
      count: count,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber,
      pageCount: Math.ceil(count / payload.pageSize),
      adminList: adminList.map((e: any) => ({
        _id: e['_id'],
        fullname: e.fullname,
        role: e.role?.title,
        phone_number: e.phone_number,
        org: e.org?.name_org,
        password: '*****',
        createdAt: e['createdAt']
      }))
    }
  }

  public async adminRetrieveOne(
    payload: AdminRetrieveOneRequest
  ): Promise<AdminRetrieveOneResponse> {
    if (!payload.id) throw new HttpException(400, 'Id required')

    const admin: any = await this.admins
      .findById(payload.id)
      .populate('org', 'name_org')
      .populate('role', 'title')
      .select('fullname phone_number createdAt org role')
      .exec()

    if (!admin) throw new HttpException(404, 'Admin not found')

    return {
      ...admin.toObject(),
      password: '*****'
    }
  }

  public async adminCreate(
    payload: AdminCreateRequest
  ): Promise<AdminCreateResponse> {

    await validationServiceInstance.validateDto(AdminCreateDto)
    const org = await this.org
      .findOne({
        _id: payload.org,
        is_active: true
      })
      .select('name_org')
      .exec()

    if (!org) throw new HttpException(404,' Org not found')
    const password = await hash(payload.password, 10)
  
    const admin = await this.admins.create({
      fullname: payload.fullname,
      phone_number: payload.phone_number,
      org: payload.org,
      role: payload.role,
      password: password
    })

    return {
      _id: admin['_id'],
      fullname: admin.fullname,
      password: '*****',
      phone_number: admin.phone_number,
      org: org.name_org,
      role: admin.role,
    }
  }

  public async adminUpdate(
    payload: AdminUpdateRequest
  ): Promise<AdminUpdateResponse> {
    await this.adminRetrieveOne({ id: payload.id })

    const updateObj:any = {}
    if (payload.role) {
      const role = await this.role.findById(payload.role)
      if (!role) throw new HttpException(404, 'Role not found')
      updateObj.role = payload.role
    }

    if (payload.org) {
      const org = await this.org.findById(payload.org)
      if (!org) throw new HttpException(404, 'Org not found')
      updateObj.org = payload.org
    }

    if (payload.password) {
      updateObj.password = await hash(payload.password, 10)
    }

    const admin = await this.admins
      .findByIdAndUpdate(payload.id, updateObj)
      .select('fullname phone_number org role')
      .populate('org', 'name_org')
      .populate('role', 'title')
      .exec()

    if (!admin) throw new HttpException(400, ' Admin is not update')

    return {
      _id: admin['_id'],
      fullname: admin.fullname,
      password: '*****',
      phone_number: admin.phone_number,
      org: admin.org,
      role: admin.role,
    }
  }

  public async adminDelete(
    payload: AdminDeleteRequest
  ): Promise<AdminDeleteResponse> {
    await this.adminRetrieveOne({ id: payload.id })
    const admin = await this.admins.findByIdAndDelete(payload.id)
    return {
      _id: admin ? admin['_id'] : payload.id
    }
  }

  async #_adminCheckPhoneNumber(payload: { phoneNumber: string }):Promise<void> {
    const admin = await this.admins.findOne({
      phone_number: payload.phoneNumber
    })

    if (admin) throw new HttpException(400, 'PhoneNumber already exist')
  }
}
