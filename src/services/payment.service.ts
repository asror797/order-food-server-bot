import { FormatNumberWithSpaces, botInstance, botTexts } from '@bot'
import { userModel, paymentModel } from '@models'
import { HttpException } from '@exceptions'
import { PaymentCreateRequest } from '@interfaces'

export class PaymentService {
  private users = userModel
  private payments = paymentModel

  public async paymentRetrieveAll(payload: any): Promise<any> {
    const paymentList = await this.payments
      .find()
      .populate('client', 'first_name last_name')
      .sort({ createdAt: -1 })
      .populate('org', 'name_org')
      .select('amount client org type')
      .exec()

    const count = await this.payments.countDocuments()

    return {
      count: count,
      pageNumber: payload.pageNumber,
      pageSize: 10,
      pageCount: Math.ceil(count / payload.pageSize),
      paymentList: paymentList
    }
  }
  public async paymentRetrieveOne(payload: any): Promise<any> {
    const payment = await this.payments.create({
      client: '',
      org: payload.org,
      amount: payload.amount,
      type: false
    })

    return payment
  }

  public async paymentCreate(payload: PaymentCreateRequest): Promise<any> {
    const user = await this.users
      .findById(payload.client)
      .select('balance telegram_id')
      .exec()
    if (!user) throw new HttpException(404, 'User not found')

    if (!payload.type && user.balance < payload.amount)
      throw new HttpException(400, 'Influnce balance')

    const newPayment = await this.payments.create({
      type: payload.type,
      amount: payload.amount,
      org: payload.org,
      client: user['_id']
    })

    botInstance.sendMessage({
      chatId: user.telegram_id,
      text: `🔺<b>${FormatNumberWithSpaces(payload.amount)}</b> so'm ${payload.type ? botTexts.increaseBalance.uz : botTexts.decreaseBalance.uz}`
    })

    return newPayment
  }

  public async paymentUpdate(): Promise<any> {}
  public async paymentDelete(): Promise<any> {}
}
