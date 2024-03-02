// import { botInstance } from '@bot'
import { userModel, paymentModel } from '@models'
import { CreatePaymentDto } from '../dtos/payment.dto'
import { HttpException } from '@exceptions'
import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth
} from 'date-fns'
import { uz } from 'date-fns/locale'
import { PaymentCreateRequest } from '@interfaces'

export class PaymentService {
  private users = userModel
  private payments = paymentModel

  public async paymentRetrieveAll(): Promise<any> {}
  public async paymentRetrieveOne(): Promise<any> {}

  public async paymentCreate(payload: PaymentCreateRequest): Promise<any> {
    const user = await this.users
      .findById(payload.client)
      .select('balance')
      .exec()

    if (!user) throw new HttpException(404, 'User not found')

    if (user.balance < payload.amount)
      throw new HttpException(400, 'Influnce balance')

    await this.users.findByIdAndUpdate(payload.client, {
      balance: payload.type
        ? user.balance + payload.amount
        : user.balance - payload.amount
    })

    const newPayment = await this.payments.create({
      type: payload.type,
      amount: payload.amount,
      org: payload.org,
      client: user['_id']
    })

    return newPayment
  }

  public async paymentUpdate(): Promise<any> {}
  public async paymentDelete(): Promise<any> {}

  public async getRetrieveAll(payload: any) {
    const { page, size } = payload
    const skip = (page - 1) * size
    const payments = await this.payments
      .find()
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .select('-updatedAt')
      .limit(size)
      .populate('org', 'name_org')
      .populate('client', 'first_name last_name phone_number roles')
      .exec()

    const totalPayments = await this.payments.countDocuments().exec()
    const totalPages = Math.ceil(totalPayments / size)

    return {
      data: payments.reverse(),
      currentPage: page,
      totalPages,
      totalPayments,
      paymentsOnPage: payments.length
    }
  }

  public async increase(paymentData: CreatePaymentDto) {
    const { user, amount } = paymentData
    const User = await this.users.findById(user)
    if (!User) throw new HttpException(400, 'user not found')

    const updatedUser = await this.users.findByIdAndUpdate(
      user,
      {
        balance: Number(User.balance) + Number(amount)
      },
      { new: true }
    )

    // botService.sendText(
    //   User.telegram_id,
    //   `🟢 Hisobingizga ${amount} so'm pul tushurildi`
    // )
    await this.payments.create({
      type: true,
      org: User.org,
      client: User['_id'],
      amount
    })

    return updatedUser
  }

  public async dicrease(paymentData: CreatePaymentDto) {
    const { user, amount, org } = paymentData
    const User = await this.users.findById(user)
    if (!User) throw new HttpException(400, 'user not found')

    const updatedUser = await this.users.findByIdAndUpdate(
      user,
      {
        balance: Number(User.balance) - Number(amount)
      },
      { new: true }
    )

    await this.payments.create({
      type: false,
      org: User.org || org,
      client: User['_id'],
      amount
    })

    // botService.sendText(
    //   User.telegram_id,
    //   `🔴 Hisobdan ${amount} so'm pul yechib olindi`
    // )

    return updatedUser
  }

  public async calculateSpents(payload: {
    user: string
    org?: string
    start?: string
    end?: string
  }) {
    const User = await this.users.findById(payload.user)
    if (!User) throw new HttpException(400, 'user not found')

    const options: any = {}
    if (payload.org) {
      options.org = payload.org
    }
    const start = payload.start
      ? new Date(payload.start)
      : startOfMonth(new Date())
    const end = payload.end ? new Date(payload.end) : endOfMonth(new Date())

    const daysOfTimeSequance = eachDayOfInterval({
      start: new Date(start),
      end: new Date(end)
    })

    interface IPayment {
      id: number
      data: number
      label: string
    }
    const allPayments: IPayment[] = []
    await Promise.all(
      daysOfTimeSequance.map(async (day, i: number) => {
        const payments = await this.payments
          .find({
            ...options,
            client: payload.user,
            type: false,
            createdAt: {
              $gte: startOfDay(day),
              $lte: endOfDay(day)
            }
          })
          .select('amount')

        allPayments.push({
          id: i,
          data: payments.reduce(
            (accumulator, currentValue) => accumulator + currentValue.amount,
            0
          ),
          label: format(day, 'MMMM d', { locale: uz })
        })
      })
    )
    return {
      totalSum: allPayments.reduce(
        (accumlator, current) => accumlator + current.data,
        0
      ),
      startDate: format(start, 'd MMMM yyyy', { locale: uz }),
      endDate: format(end, 'd MMMM yyyy', { locale: uz }),
      data: allPayments.sort((a, b) => a.id - b.id)
    }
  }
}
