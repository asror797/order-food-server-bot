import { botService } from '@bot'
import { userModel, paymentModel } from '@models'
import { CreatePaymentDto } from '../dtos/payment.dto'
import { HttpException } from '@exceptions'

export class PaymentService {
  private userRepo = userModel
  private paymentRepo = paymentModel

  public async getRetrieveAll(payload: any) {
    const { page, size } = payload
    const skip = (page - 1) * size
    const payments = await this.paymentRepo
      .find()
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .select('-updatedAt')
      .limit(size)
      .populate('org', 'name_org')
      .populate('client', 'first_name last_name phone_number roles')
      .exec()

    const totalPayments = await this.paymentRepo.countDocuments().exec()
    const totalPages = Math.ceil(totalPayments / size)

    return {
      data: payments.reverse(),
      currentPage: page,
      totalPages,
      totalPayments,
      paymentsOnPage: payments.length,
    }
  }

  public async increase(paymentData: CreatePaymentDto) {
    const { user, amount, org } = paymentData
    const User = await this.userRepo.findById(user)
    if (!User) throw new HttpException(400, 'user not found')

    const updatedUser = await this.userRepo.findByIdAndUpdate(
      user,
      {
        balance: Number(User.balance) + Number(amount),
      },
      { new: true },
    )

    botService.sendText(
      User.telegram_id,
      `🟢 Hisobingizga ${amount} so'm pul tushurildi`,
    )
    await this.paymentRepo.create({
      type: true,
      org: User.org,
      client: User['_id'],
      amount,
    })

    return updatedUser
  }

  public async dicrease(paymentData: CreatePaymentDto) {
    const { user, amount, org } = paymentData
    const User = await this.userRepo.findById(user)
    if (!User) throw new HttpException(400, 'user not found')

    const updatedUser = await this.userRepo.findByIdAndUpdate(
      user,
      {
        balance: Number(User.balance) - Number(amount),
      },
      { new: true },
    )

    await this.paymentRepo.create({
      type: false,
      org: User.org || org,
      client: User['_id'],
      amount,
    })

    botService.sendText(
      User.telegram_id,
      `🔴 Hisobdan ${amount} so'm pul yechib olindi`,
    )

    return updatedUser
  }
}
