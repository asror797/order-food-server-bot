import botService from "../bot/bot";
import { CreatePaymentDto } from "../dtos/payment.dto";
import { httException } from "../exceptions/httpException";
import paymentModel from "../models/payment.model";
import userModel from "../models/user.model";

class PaymentService {
  private userRepo = userModel;
  private paymentRepo = paymentModel;

  public async increase(paymentData: CreatePaymentDto) {
    const { user , amount } = paymentData;
    const User = await this.userRepo.findById(user);
    if(!User) throw new httException(400,'user not found')

    const updatedUser = await this.userRepo.findByIdAndUpdate(user,{
      balance: Number(User.balance) + Number(amount)
    },{ new: true });

    botService.sendText(User.telegram_id,`🟢 Hisobingizga ${amount} s*m pul tushurildi`)
    await this.paymentRepo.create({
      type: true,
      org: User.org,
      client: User['_id'],
      amount
    });

    return updatedUser;
  }

  public async dicrease(paymentData:CreatePaymentDto) {
    const { user , amount } = paymentData;
    const User = await this.userRepo.findById(user);
    if(!User) throw new httException(400,'user not found')

    const updatedUser = await this.userRepo.findByIdAndUpdate(user,{
      balance: Number(User.balance) - Number(amount)
    },{ new: true });

    await this.paymentRepo.create({
      type: false,
      org: User.org,
      client: User['_id'],
      amount
    });

    botService.sendText(User.telegram_id,`🔴 Hisobdan ${amount} s*m pul yechib olindi`)

    return updatedUser;
  }
}


export default PaymentService;