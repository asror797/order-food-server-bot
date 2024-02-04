import { botService } from '@bot'
import { userModel, paymentModel } from '@models'
import { CreatePaymentDto } from '../dtos/payment.dto'
import { HttpException } from '@exceptions'
import { eachDayOfInterval, endOfDay, endOfMonth, format, startOfDay, startOfMonth } from 'date-fns'
import { uz } from 'date-fns/locale'

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

  public async calculateSpents(payload: {user: string , org?: string, start?: string, end?: string }) {
    const User = await this.userRepo.findById(payload.user)
    if (!User) throw new HttpException(400, 'user not found')

    const options: any = {}
    if(payload.org) {
      options.org = payload.org
    }
    const start = payload.start ? new Date(payload.start) : startOfMonth(new Date())
    const end = payload.end ?  new Date(payload.end) : endOfMonth(new Date())

    const daysOfTimeSequance = eachDayOfInterval({
      start: new Date(start),
      end: new Date(end)
    })
    
    interface IPayment {
      id: number
      data: number
      label: string
    }
    const allPayments:IPayment[] = []
    await Promise.all(daysOfTimeSequance.map(async(day,i:number) => {

      const payments = await this.paymentRepo.find({
        ...options,
        client: payload.user,
        type: false,
        createdAt: {
          $gte: startOfDay(day),
          $lte: endOfDay(day)
        }
      }).select('amount')


      allPayments.push({
        id: i,
        data: payments.reduce((accumulator, currentValue) => accumulator + currentValue.amount ,0),
        label: format(day, 'MMMM d', { locale: uz })
      })

    }))
    return {
      totalSum: allPayments.reduce((accumlator, current) => accumlator + current.data , 0),
      startDate: format(start,'d MMMM yyyy', { locale: uz}),
      endDate: format(end,'d MMMM yyyy', { locale: uz}),
      data: allPayments
    }
  }
}
