import { FormatNumberWithSpaces, botInstance, botTexts } from '@bot'
import { userModel, paymentModel } from '@models'
import { HttpException } from '@exceptions'
import { PaymentCreateRequest } from '@interfaces'

export class PaymentService {
  private users = userModel
  private payments = paymentModel

  public async paymentRetrieveAll(): Promise<any> {}
  public async paymentRetrieveOne(): Promise<any> {}

  public async paymentCreate(payload: PaymentCreateRequest): Promise<any> {
    const user = await this.users
      .findById(payload.client)
      .select('balance telegram_id')
      .exec()
    if (!user) throw new HttpException(404, 'User not found')

    if (!payload.type && user.balance < payload.amount)
      throw new HttpException(400, 'Influnce balance')

    await this.users.findByIdAndUpdate(payload.client, {
      balance: payload.type
        ? user.balance + payload.amount
        : user.balance - payload.amount
    })

    botInstance.sendMessage({
      chatId: user.telegram_id,
      text: `🔺<b>${FormatNumberWithSpaces(payload.amount)}</b> so'm ${payload.type ? botTexts.increaseBalance.uz : botTexts.decreaseBalance.uz}`
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
}
