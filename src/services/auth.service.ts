import jwt from 'jsonwebtoken'
import { adminModel } from '@models'
import { formatPhoneNumber } from '@utils'
import { HttpException } from '@exceptions'
import { AdminAuthRequest, AdminAuthResponse } from '@interfaces'
import { compare } from 'bcrypt'

export class AuthService {
  public admins = adminModel

  public async generateRefreshToken(payload: { id: string }): Promise<string> {
    return ''
  }

  public async decodeRefreshToken(payload: {}) {}

  public async genereateAccessToken(payload: any) {
    /**
     * org
     * userId
     * role {
     *   modules: [
     *      uri
     *      permission
     *      actions: [
     *        {
     *          permission
     *          uri
     *        }
     *      ]
     *   ]
     * }
     *
     *
     *
     */

    return jwt.sign(payload.data, 'secret_key', { expiresIn: 500 })
  }

  public async decodeAccessToken(token: string) {}

  public async adminAuthSignIn(payload: {
    phoneNumber: string
    password: string
  }) {
    const admin = await this.admins
      .findOne({
        phone_number: payload.phoneNumber
      })
      .populate('role')
      .select('phone_number password role org')
      .exec()

    if (!admin) throw new HttpException(400, 'PhoneNumber or Password is wrong')

    const isPasswordCorrect = await compare(admin.password, payload.password)
    if (!isPasswordCorrect) {
      throw new HttpException(400, 'PhoneNumber or Password is wrong')
    }

    return {
      accessToken: await this.genereateAccessToken({}),
      refreshToken: await this.generateRefreshToken({ id: '' })
    }
  }

  public async adminAuthSignOut() {}
}
