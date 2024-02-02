import jwt from 'jsonwebtoken'
import { adminModel } from '@models'
import { formatPhoneNumber } from '@utils'
import { HttpException } from '@exceptions'
import { AdminLoginDto } from '../dtos/admin.dto'

export class AuthService {
  public admin = adminModel
  private admins = [
    {
      phone_number: '+998913650221',
      password: '12345678',
    },
  ]

  public async generateAccessToken(payload:{ phoneNumber: string, id: string }) {

    const Admin = await this.admin.findById(payload.id).populate({ path: 'role',select: 'modules title'}).select('role phone_number org').exec()

    console.log(Admin)

    if(!Admin) throw new HttpException(400,'Admin not found')

    return jwt.sign({id: Admin['_id'], modules: Admin.role.modules , org: Admin.org },'secret_key', { expiresIn: '1m'})
  }
 
  public async generateRefreshToken(payload: { phoneNumber: string, id: string }) {
    const Admin = await this.admin.findById(payload.id).select('role').exec()

    if(!Admin) throw new HttpException(400,'Admin not found')

    return jwt.sign({ id: Admin['_id'], role: Admin.role.title },'secret_key')
  }

  public async login(payload:{ phoneNumber: string, password: string}) {
    const Admin = await this.admin.findOne({ phone_number: payload.phoneNumber }).select('phone_number password').exec()
    
    console.log(Admin)

    if(!Admin || Admin.password !== payload.password ) throw new HttpException(400,'PhoneNumber or Password is wrong')

    return {
      accesstoken: await this.generateAccessToken({id: Admin['_id'], phoneNumber: Admin.phone_number }),
      refreshToken: await this.generateRefreshToken({id: Admin['_id'], phoneNumber: Admin.phone_number })
    }
  }

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
