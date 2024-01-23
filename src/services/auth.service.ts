import { userModel } from '@models'
import jwt from 'jsonwebtoken'
import { formatPhoneNumber } from '../utils/phoneNumberFormatter'
import { HttpException } from '../exceptions/httpException'
import { AdminLoginDto } from '../dtos/admin.dto'

export class AuthService {
  private users = userModel
  private admins = [
    {
      phone_number: '+998913650221',
      password: '12345678',
    },
  ]

  public async accessToken() {}

  public async refreshToken() {}
  

  public loginAdmin(adminDto: AdminLoginDto) {
    const { phone_number, password } = adminDto
    const validatedPhoneNumber = formatPhoneNumber(phone_number)
    if (!validatedPhoneNumber)
      throw new HttpException(400, 'invalid format of phone_number')

    const isExist = this.admins.find(
      (e) => e.phone_number == `+998${validatedPhoneNumber}`,
    )

    if (!isExist) throw new HttpException(400, 'not found admin')

    if (password != isExist.password)
      throw new HttpException(200, 'password or phone_number wrong')

    return {
      token: jwt.sign(JSON.stringify({ ...isExist }), 'secret_key'),
    }
  }
}
