import { AdminLoginDto, CreateAdmin } from '../dtos/admin.dto'
import { HttpException } from '../exceptions/httpException'
import { adminModel, orgModel, roleModel } from '@models'
import jwt from 'jsonwebtoken'

export class AdminService {
  public admins = adminModel
  public role = roleModel
  public org = orgModel

  public async getAdmins() {
    return await this.admins.find().populate({ path: 'org',select: ' name_org'}).populate({ path: 'role', select: 'title module'}).exec()
  }

  public async createAdmin(adminData: CreateAdmin) {
    const newAdmin = await this.admins.create(adminData)
    return newAdmin
  }

  public async create(payload:any) {
    const role = await this.role.findById(payload.roleId)
    const org = await this.org.findById(payload.orgId)

    if(!org || !role ) {
      throw new HttpException(400,'Role or Org not found')
    }

    const newAdmin = await this.admins.create({
      password: payload.password,
      fullname: payload.fullname,
      org: payload.orgId,
      phone_number: payload.phoneNumber,
      role: payload.roleId
    })

    return newAdmin
  }

  public async loginAdmin(adminData: AdminLoginDto) {
    const { password, phone_number } = adminData

    let admin: any = await this.admins.find({
      phone_number: phone_number,
    })

    if (admin.length >= 0) {
      admin = admin[0]
    }

    if (!admin) throw new HttpException(400, 'user not found')

    console.log(admin)
    if (admin.password != password) {
      throw new HttpException(400, 'password or phone_number wrong')
    }
    return {
      token: jwt.sign(JSON.stringify(admin), 'secret_key'),
      admin: {
        fullname: admin.fullname,
        role: admin.role,
      },
    }
  }

  public async updateAdmin(payload: any) {
    const { admin, fullname, password, newPassword } = payload

    const Admin = await this.admins.findById(admin)

    if (!Admin) throw new HttpException(400, 'admin is not defined')

    interface IUpdate {
      fullname?: string
      password?: string
    }

    const updatesData: IUpdate = {}

    if (fullname) {
      updatesData.fullname = fullname
    }

    if (newPassword) {
      if (Admin.password !== password)
        throw new HttpException(400, 'old password is wrong')
      updatesData.password = newPassword
    }

    const updatedAdmin = await this.admins.findOneAndUpdate(
      {
        _id: admin,
      },
      { ...updatesData },
      { new: true },
    )

    return updatedAdmin
  }

  public async updateAdminRole(payload:any) {
    const { id, role, } = payload

    const Admin = await this.admins.findById(id).exec()
    if(!Admin) {
      throw new HttpException(400,'Admin Not Found')
    }
    const Role = await this.role.findById(role).exec()
    if(!Role) {
      throw new HttpException(400,'Not Found Role')
    }

    const updatedAdmin = await this.admins.findOneAndUpdate({ _id: id },{ $set: { role: role } }, { returnDocument: 'after'})

    return updatedAdmin;
  }
}

export default AdminService
