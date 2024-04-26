import { userModel, orgModel } from '@models'
import { formatPhoneNumber } from '@utils'
import { HttpException } from '@exceptions'
import { CreateUserDto, EditUserDto, SendMessae } from '../dtos/user.dto'
import {
  UserRegisterPayload,
  UserCheckResponse,
  UserRetrieveAllRequest,
  ActiveUserList
} from '@interfaces'
import { PaymentService } from '@services'
import { botInstance } from '@bot'

export class UserService {
  private users = userModel
  private orgs = orgModel
  private paymentLogService = new PaymentService()

  public async registirNewUser(userData: CreateUserDto) {
    const phone_number = formatPhoneNumber(userData.phone_number)
    const newUser = await this.users.create({
      ...userData,
      phone_number
    })
    return newUser
  }

  public async checkUser(payload: {
    telegramId: number
  }): Promise<UserCheckResponse> {
    const user = await this.users
      .findOne({
        telegram_id: payload.telegramId
      })
      .populate('org', 'name_org group_a_id group_b_id')
      .select('-createdAt -updatedAt')
      .exec()

    return {
      isExist: !!user,
      user: user
    }
  }

  public async checkBalance(payload: {
    user: string
    amount: number
  }): Promise<boolean> {
    const user = await this.userRetrieveOne({ id: payload.user })

    if (user.balance >= payload.amount) {
      return true
    }

    return false
  }

  public async retrieveActiveUsers(): Promise<ActiveUserList[]> {
    const users = await this.users
      .find({
        is_active: true,
        is_verified: true,
        role: 'user'
      })
      .select('telegram_id')
      .exec()

    return users
  }

  public async registerUser(payload: UserRegisterPayload): Promise<any> {
    const user = await this.users.create({
      telegram_id: payload.telegramId,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone_number: payload.phoneNumber
    })

    return user
  }

  public async userRetrieveAll(payload: UserRetrieveAllRequest): Promise<any> {
    const query: any = {}
    if (payload.org) {
      const org = await this.orgs
        .findById(payload.org)
        .select('name_org')
        .exec()
      if (!org) throw new HttpException(404, 'Org not found')
      query.org = payload.org
    }

    if (payload.search) {
      query.$or = [
        { first_name: { $regex: new RegExp(payload.search, 'i') } },
        { last_name: { $regex: new RegExp(payload.search, 'i') } },
        { phone_number: { $regex: new RegExp(payload.search, 'i') } }
      ]
    }

    console.log(query)

    const userList = await this.users
      .find(query)
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .populate('org', 'name_org')
      .select(
        'first_name last_name role balance phone_number org is_active is_verified'
      )
      .exec()

    const count = await this.users.countDocuments(query)

    return {
      count: count,
      pageSize: payload.pageSize,
      pageNumber: payload.pageNumber,
      pageCount: Math.ceil(count / payload.pageSize),
      userList: userList.map((e) => ({
        _id: e['_id'],
        first_name: e.first_name,
        last_name: e.last_name,
        phone_number: e.phone_number,
        role: e.role,
        org: e.org?.name_org || null,
        balance: e.balance,
        is_verified: e.is_verified,
        is_active: e.is_active
      }))
    }
  }

  public async userRetrieveOne(payload: { id: string }) {
    const user = await this.users
      .findById(payload.id)
      .populate('org', 'name_org')
      .select(
        'first_name last_name role pone_number balance is_active is_verified telegram_id'
      )
      .exec()

    if (!user) throw new HttpException(404, 'user not found')

    return user
  }

  public async userUpdate(payload: EditUserDto) {
    const User = await this.users.findById(payload.id)
    if (!User) throw new HttpException(400, 'user not found')
    const updateData: {
      org?: string
      first_name?: string
      last_name?: string
      role?: string
      is_verified?: boolean
      is_active?: boolean
    } = {}

    if (payload.org) {
      const Org = await this.orgs.findById(payload.org)
      if (!Org) throw new HttpException(400, 'org not found')
      updateData.org = payload.org
    }

    if (payload.first_name) {
      updateData.first_name = payload.first_name
    }

    if (payload.last_name) {
      updateData.last_name = payload.last_name
    }

    if (payload.role && (payload.role == 'user' || 'cook')) {
      updateData.role = payload.role
    }

    if (payload.is_verified != null) {
      updateData.is_verified = payload.is_verified
    }

    if (payload.is_active != null) {
      updateData.is_active = payload.is_active
    }

    const updateduser = await this.users
      .findByIdAndUpdate(payload.id, updateData, {
        new: true
      })
      .select('-createdAt -updatedAt -language_code')
      .exec()

    return updateduser
  }

  public async userUpdateBalance(payload: {
    type: boolean
    amount: number
    user: string
  }) {
    const user = await this.userRetrieveOne({ id: payload.user })
    // console.log('USER SERVICE', user)

    if (payload.amount < 0)
      throw new HttpException(400, 'Amount should be positive')

    if (payload.type === true) {
      const depositeUser = await this.users
        .findByIdAndUpdate(
          payload.user,
          {
            balance: user.balance + payload.amount
          },
          { new: true }
        )
        .select('phone_number balance telegram_id')
        .exec()
      
      botInstance.sendMessage({ text: `<b>📥${payload.amount} so'm hisobga tushurildi.</b>`, chatId: user.telegram_id })  
      return depositeUser
    }

    if (payload.type == false && user.balance > payload.amount) {
      const withdrawUser = await this.users
        .findByIdAndUpdate(
          payload.user,
          {
            balance: user.balance - payload.amount
          },
          { new: true }
        )
        .select('phone_number balance')
        .exec()

      botInstance.sendMessage({ text: `<b>📤${payload.amount} so'm hisobdan yechib olindi.</b>`, chatId: user.telegram_id })
      return withdrawUser
    }
  }

  public async sendMessageToUsers(msgData: SendMessae) {
    const { org } = msgData

    if (org == 'all' || org == null) {
      const users = await this.users.find({
        is_active: true,
        is_verified: true
      })
      users.map((e) => {
        console.log(e)
        // botService.sendText(e.telegram_id, message)
      })

      return {
        message: 'sent',
        status: 200
      }
    } else {
      const Org = await this.orgs.findById(org)
      if (Org) throw new HttpException(400, 'org not found')
      const users = await this.users.find({
        is_active: true,
        is_verified: true,
        org: org
      })
      users.map((e) => {
        // botService.sendText(e.telegram_id, message)
      })
      return {
        message: 'ok',
        status: 'ok'
      }
    }
  }

  public async userDelete(payload: { id: string }) {
    await this.userRetrieveOne({ id: payload.id })
    const deletedUser = await this.users.findByIdAndDelete(payload.id)

    return {
      _id: deletedUser ? deletedUser['_id'] : payload.id
    }
  }
}
