import jwt from 'jsonwebtoken'
import { adminModel } from '@models'
import { formatPhoneNumber } from '@utils'
import { HttpException } from '@exceptions'
import { AdminAuthRequest, AdminAuthResponse } from '@interfaces'
import { compare } from 'bcrypt'
import {
  JWT_ACCESS_TOKEN_SECRET_KEY,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET_KEY,
  JWT_REFRESH_TOKEN_EXPIRY
} from '@config'

export class AuthService {
  public admins = adminModel

  public async generateRefreshToken(payload: {
    adminId: string
    orgId: string
    roleId: any
  }): Promise<string> {
    const data = {
      admin: payload.adminId,
      role: payload.roleId,
      org: payload.orgId
    }
    return jwt.sign(data, JWT_REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY
    })
  }

  public async decodeRefreshToken(payload: { token: string }) {
    const decodedToken = jwt.verify(payload.token, JWT_REFRESH_TOKEN_SECRET_KEY)

    return decodedToken // adminId,OrgId,roleId
  }

  public async genereateAccessToken(payload: {
    adminId: string
    orgId: string
    role: any
  }) {
    const data = {
      admin: payload.adminId,
      org: payload.orgId,
      role: payload.role,
      modules: payload.role.modules
    }

    return jwt.sign(data, JWT_ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY
    })
  }

  public async decodeAccessToken(token: string) {
    const decodedToken = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET_KEY)

    console.log(decodedToken)

    return decodedToken
  }

  public async adminAuthSignIn(payload: {
    phoneNumber: string
    password: string
  }) {
    console.log(payload)
    if (!payload.phoneNumber || !payload.password)
      throw new HttpException(400, 'PhoneNumber and Password is required')
    const admin: any = await this.admins
      .findOne({
        phone_number: payload.phoneNumber
      })
      .populate('role')
      .select('phone_number password role org')
      .exec()

    console.log(admin)
    if (!admin) throw new HttpException(400, 'PhoneNumber or Password is wrong')

    if (!admin.role) throw new HttpException(400, 'Admin role not found')

    const isPasswordCorrect = await compare(payload.password, admin.password)
    if (!isPasswordCorrect) {
      throw new HttpException(400, 'PhoneNumber or Password is wrong')
    }

    return {
      accessToken: await this.genereateAccessToken({
        adminId: admin['_id'],
        orgId: admin.org,
        role: admin.role
      }),
      refreshToken: await this.generateRefreshToken({
        adminId: admin['_id'],
        orgId: admin.org,
        roleId: admin.role['_id']
      })
    }
  }

  public async adminAuthRefresh(payload: { refreshToken: string }) {
    const decodedToken = (await this.decodeRefreshToken({
      token: payload.refreshToken
    })) as any
    //  adminId,OrgId,roleId
    const admin = await this.admins.findOne({
      _id: decodedToken.adminId,
      refreshToken: ''
    })

    if (!admin) throw new HttpException(400, "Admin's creditials is wrong")

    return {
      accessToken: await this.genereateAccessToken({
        adminId: admin['_id'],
        orgId: '',
        role: ''
      }),
      refreshToken: await this.generateRefreshToken({
        adminId: admin['_id'],
        orgId: '',
        roleId: ''
      })
    }
  }

  public async adminAuthSignOut() {}
}
