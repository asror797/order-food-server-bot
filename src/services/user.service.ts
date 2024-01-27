import { userModel, orgModel } from '@models'
import { formatPhoneNumber } from '@utils'
import { HttpException } from '@exceptions'
import { botService } from '@bot'
import {
  ChangeOrg,
  ChangeStatus,
  CreateUserDto,
  EditUserDto,
  SearchPagination,
  SendMessae,
  UpdateUserDto,
} from '../dtos/user.dto'
import { IUser, UserRole } from '../interfaces/user.interface'

export class UserService {
  private users = userModel
  private orgs = orgModel

  public async isExist(telegramID: number):Promise<any> {
    const user = await this.users
      .findOne({
        telegram_id: telegramID,
      })
      .populate('org', 'name_org group_a_id group_b_id')

    if (user) {
      return {
        data: user,
        message: 'user exist',
      }
    } else {
      return {
        data: null,
        message: 'user not found',
      }
    }
  }

  public async registirNewUser(userData: CreateUserDto) {
    const phone_number = formatPhoneNumber(userData.phone_number)
    const newUser = await this.users.create({
      ...userData,
      phone_number,
    })
    return newUser
  }

  public async userRetrieveAll(payload: SearchPagination) {
    const { search, page, size } = payload
    if (!search || search.trim() === '') {
      const users = await this.users
        .find()
        .sort({ createdAt: -1 })
        .populate('org', 'name_org')
        .skip((page - 1) * size)
        .limit(size)
        .exec()

      const totalUsers = await this.users.countDocuments().exec()
      const totalPages = Math.ceil(totalUsers / size)
      return {
        data: users,
        currentPage: page,
        totalPages,
        totalUsers,
        usersOnPage: users.length,
      }
    }

    const re = new RegExp(search, 'i')
    const skip = (page - 1) * size

    const users = await this.users
      .find({
        $or: [
          { phone_number: { $regex: re } },
          { first_name: { $regex: re } },
          { last_name: { $regex: re } },
        ],
      })
      .populate('org', 'name_org')
      .skip(skip)
      .limit(size)
      .exec()

    const totalUsers = await this.users.countDocuments().exec()
    const totalPages = Math.ceil(totalUsers / size)
    return {
      data: users,
      currentPage: page,
      totalPages,
      totalUsers,
      usersOnPage: users.length,
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
      usersOnPage: users.length,
    }
  }

  public async userRetrieveOne(payload: {telegramId: number} ) {
    const user = await this.users.findOne({ telegram_id: payload.telegramId }).populate('org',' group_a_id').exec()

    return user
  }

  public async getBalance(telegramID: number): Promise<IUser | null> {
    const user = await this.users.findOne({
      telegram_id: telegramID,
    })
    return user
  }

  public async updateUser(userData: UpdateUserDto) {
    const { _id, is_active, type } = userData

    if (type == 'verify') {
      const updatedUser = await this.users.findByIdAndUpdate(
        userData['_id'],
        { is_verified: true, is_active: true },
        { new: true },
      )

      return updatedUser
    } else if (type == 'status') {
      if (is_active == true) {
        const updateUser = await this.users.findByIdAndUpdate(
          _id,
          { is_active: true },
          { new: true },
        )
        return updateUser
      } else if (is_active == false) {
        const updateUser = await this.users.findByIdAndUpdate(
          _id,
          { is_active: false },
          { new: true },
        )
        return updateUser
      } else {
        return {
          message: 'ok',
          status: 200,
        }
      }
    }
  }

  public async editUser(payload: EditUserDto) {
    const { id, first_name, last_name, org } = payload
    const User = await this.users.findById(id)
    if (!User) throw new HttpException(400, 'user not found')
    const updateData: {
      org?: string
      first_name?: string
      last_name?: string
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

    const updateduser = await this.users.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    return updateduser
  }

  public async sendMessageToUsers(msgData: SendMessae) {
    const { org, message } = msgData

    if (org == 'all' || org == null) {
      const users = await this.users.find({
        is_active: true,
        is_verified: true,
      })
      users.map((e) => {
        botService.sendText(e.telegram_id, message)
      })

      return {
        message: 'sent',
        status: 200,
      }
    } else {
      const Org = await this.orgs.findById(org)
      if (Org) throw new HttpException(400, 'org not found')
      const users = await this.users.find({
        is_active: true,
        is_verified: true,
        org: org,
      })
      users.map((e) => {
        botService.sendText(e.telegram_id, message)
      })
      return {
        message: 'ok',
        status: 'ok',
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
          _id: user,
        },
        {
          is_active: true,
          is_verified: true,
        },
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
        org: org,
      },
      { new: true },
    )

    return updatedUser
  }

  public async transitPayment(userData: any) {
    const { type, amount, user } = userData

    const User = await this.users.findById(user)

    if (!User) throw new HttpException(400, 'user not found')

    if (type == 'increase') {
      const updateduser = await this.users.findByIdAndUpdate(
        user,
        {
          balance: User.balance + Number(amount),
        },
        { new: true },
      )
      return updateduser
    } else if (type == 'decrease') {
      if (User.balance < amount) throw new HttpException(200, 'you cant')
      const updateduser = await this.users.findByIdAndUpdate(
        user,
        {
          balance: User.balance - Number(amount),
        },
        { new: true },
      )
      return updateduser
    } else {
      return {
        message: 'something is missing',
        status: 200,
      }
    }
  }

  // public async addRole(userData: any) {
  //   const { user, role } = userData

  //   const User = await this.users.findById(user)

  //   if (!User) throw new HttpException(200, 'user not found')
  //   if (!Object.values(UserRole).includes(role)) {
  //     throw new HttpException(200, 'Invalid role')
  //   }

  //   if (User.roles.includes(role)) {
  //     throw new Error('User already has this role')
  //   }

  //   User.roles.push(role)

  //   const updatedUser = await User.save()

  //   return updatedUser
  // }

  // public async removeRole(userData: any) {
  //   const { user, role } = userData
  //   const User = await this.users.findById(user)

  //   if (!User) {
  //     throw new HttpException(200, 'User not found')
  //   }

  //   if (!Object.values(UserRole).includes(role)) {
  //     throw new HttpException(200, 'Invalid role')
  //   }

  //   if (!User.roles.includes(role)) {
  //     throw new Error('User does not have this role')
  //   }

  //   console.log(User)

  //   User.roles = User.roles.filter((e: string) => e !== role)

  //   const updatedUser = await User.save()

  //   return updatedUser
  // }

  public async transaction(userData: any) {
    const { telegram_id, type, amount } = userData
    const user = await this.users.findOne({
      telegram_id: telegram_id,
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
          { last_name: { $regex: re } },
        ],
      })
      .populate('org', 'name_org')
      .limit(5)
      .exec()
    return users
  }

  public async getTelegramIDOfClients(org: string) {
    const Org = await this.orgs.findById(org)
    if (!Org) throw new HttpException(400, 'org not found')
    const clients = await this.users
      .find({
        org: org,
        $and: [{ roles: 'user' }, { roles: { $nin: ['cook'] } }],
      })
      .select('telegram_id roles')
      .exec()

    return clients
  }

  public async revenueOfUser(payload: any) {
    const { user } = payload
    const User = await this.users.findById(user)

    if (!User) throw new HttpException(200, 'user not found')
  }
}
