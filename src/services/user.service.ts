import { userModel, orgModel } from '@models'
import { formatPhoneNumber } from '@utils'
import { HttpException } from '@exceptions'
// import { botService } from '@bot'
import {
  ChangeOrg,
  ChangeStatus,
  CreateUserDto,
  EditUserDto,
  SendMessae,
  UpdateUserDto
} from '../dtos/user.dto'
import { IUser } from '@interfaces'
import {
  UserRegisterPayload,
  UserCheckResponse,
  UserRetrieveAllRequest,
  ActiveUserList
} from '@interfaces'

export class UserService {
  private users = userModel
  private orgs = orgModel

  public async isExist(telegramID: number): Promise<any> {
    const user = await this.users
      .findOne({
        telegram_id: telegramID
      })
      .populate('org', 'name_org group_a_id group_b_id')

    if (user) {
      return {
        data: user,
        message: 'user exist'
      }
    } else {
      return {
        data: null,
        message: 'user not found'
      }
    }
  }

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
    if (payload.search) {
      query.$or = [
        { first_name: { $regex: new RegExp(payload.search, 'i') } },
        { last_name: { $regex: new RegExp(payload.search, 'i') } },
        { phone_number: { $regex: new RegExp(payload.search, 'i') } }
      ]
    }

    const userList = await this.users
      .find(query)
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .populate('org', 'name_org')
      .select('first_name last_name role balance phone_number org is_active is_verified')
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
        org: e.org ? e.org.name_org : null,
        balance: e.balance,
        is_verified: e.is_verified,
        is_active: e.is_active
      }))
    }
  }

  public async getUsers(page: number, size: number) {
    const skip = (page - 1) * size

    const users = await this.users
      .find()
      .select('-updatedAt')
      .skip(skip)
      .limit(size)
      .populate('org', 'name_org')
      .exec()
    const totalUsers = await this.users.countDocuments().exec()
    const totalPages = Math.ceil(totalUsers / size)
    return {
      data: users,
      currentPage: page,
      totalPages,
      totalUsers,
      usersOnPage: users.length
    }
  }

  public async userRetrieveOne(payload: { id: string }) {
    const user = await this.users
      .findById(payload.id)
      .populate('org', 'name_org')
      .select('first_name last_name role pone_number balance')
      .exec()

    if (!user) throw new HttpException(404, 'user not found')

    return user
  }

  public async getBalance(telegramID: number): Promise<IUser | null> {
    const user = await this.users.findOne({
      telegram_id: telegramID
    })
    return user
  }

  public async updateUser(userData: UpdateUserDto) {
    const { _id, is_active, type } = userData

    if (type == 'verify') {
      const updatedUser = await this.users.findByIdAndUpdate(
        userData['_id'],
        { is_verified: true, is_active: true },
        { new: true }
      )

      return updatedUser
    } else if (type == 'status') {
      if (is_active == true) {
        const updateUser = await this.users.findByIdAndUpdate(
          _id,
          { is_active: true },
          { new: true }
        )
        return updateUser
      } else if (is_active == false) {
        const updateUser = await this.users.findByIdAndUpdate(
          _id,
          { is_active: false },
          { new: true }
        )
        return updateUser
      } else {
        return {
          message: 'ok',
          status: 200
        }
      }
    }
  }

  public async userUpdate(payload: EditUserDto) {
    const { id, first_name, last_name, org, role } = payload
    const User = await this.users.findById(id)
    if (!User) throw new HttpException(400, 'user not found')
    const updateData: {
      org?: string
      first_name?: string
      last_name?: string
      role?: string
    } = {}

    if (org) {
      const Org = await this.orgs.findById(org)
      if (!Org) throw new HttpException(400, 'org not found')
      updateData.org = payload.org
    }

    if (first_name) {
      updateData.first_name = first_name
    }

    if (last_name) {
      updateData.last_name = last_name
    }

    if (role && (role == 'user' || 'cook')) {
      updateData.role = payload.role
    }

    const updateduser = await this.users.findByIdAndUpdate(id, updateData, {
      new: true
    })

    return updateduser
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
        console.log(e)
        // botService.sendText(e.telegram_id, message)
      })
      return {
        message: 'ok',
        status: 'ok'
      }
    }
  }

  public async changeStatus(userData: ChangeStatus) {
    const { user, type } = userData
    const isExist = await this.users.findById(user)

    if (!isExist) throw new HttpException(400, 'user not exist')
    if (type == 'verify') {
      return await this.users.findOneAndUpdate(
        {
          _id: user
        },
        {
          is_active: true,
          is_verified: true
        }
      )
    } else {
      return {}
    }
  }

  public async ChangeOrg(userData: ChangeOrg) {
    const { user, org } = userData

    const Org = await this.orgs.findById(org)
    const User = await this.users.findById(user)

    if (!User) throw new HttpException(400, 'user not found')

    if (!Org) throw new HttpException(400, 'org not found')

    const updatedUser = await this.users.findByIdAndUpdate(
      user,
      {
        org: org
      },
      { new: true }
    )

    return updatedUser
  }

  public async getTelegramIDOfClients() {}

  public async transitPayment(userData: any) {
    const { type, amount, user } = userData

    const User = await this.users.findById(user)

    if (!User) throw new HttpException(400, 'user not found')

    if (type == 'increase') {
      const updateduser = await this.users.findByIdAndUpdate(
        user,
        {
          balance: User.balance + Number(amount)
        },
        { new: true }
      )
      return updateduser
    } else if (type == 'decrease') {
      if (User.balance < amount) throw new HttpException(200, 'you cant')
      const updateduser = await this.users.findByIdAndUpdate(
        user,
        {
          balance: User.balance - Number(amount)
        },
        { new: true }
      )
      return updateduser
    } else {
      return {
        message: 'something is missing',
        status: 200
      }
    }
  }

  public async transaction(userData: any) {
    const { telegram_id, type, amount } = userData
    const user = await this.users.findOne({
      telegram_id: telegram_id
    })
    if (!user) throw new Error('user not found')
    if (user.balance < amount && type == false) throw new Error('')
    if (type == true) {
    } else if (type == false) {
    }
  }

  public async searchUser(data: string) {
    const re = new RegExp(data, 'i')
    console.log(re, data)
    if (data === undefined && data === '')
      throw new HttpException(200, 'search word is empty')

    const users = await this.users
      .find({
        $or: [
          { phone_number: { $regex: re } },
          { first_name: { $regex: re } },
          { last_name: { $regex: re } }
        ]
      })
      .populate('org', 'name_org')
      .limit(5)
      .exec()
    return users
  }
}
