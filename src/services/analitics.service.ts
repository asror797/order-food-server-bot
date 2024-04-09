import { HttpException } from '@exceptions'
import { orderModel, userModel } from '@models'
import { eachDayOfInterval, endOfDay, startOfDay } from 'date-fns'

export class AnaliticsService {
  public orders = orderModel
  private users = userModel

  public async mostPurchaseUser() {}
  public async mostSoldProduct() {}
  public async totalOrders() {}
  public async totalPaidOrders() {}

  public async getUserMonthlyAnalitics(payload: any) {
    const startDay = new Date(2024, 2, 1)
    const endDay = new Date(2024, 2, 31)
    const orders: any = []

    const user = await this.users.findById(payload.user)
    if (!user) throw new HttpException(404, 'User not found')

    const days = eachDayOfInterval({
      start: new Date(startDay),
      end: new Date(endDay)
    })
    console.log(days)

    await Promise.all(
      days.map(async (e) => {
        const daysOrder: any = []
        const ordersOfUser = await this.orders
          .find({
            is_accepted: true,
            createdAt: {
              $gte: startOfDay(e),
              $lte: endOfDay(e)
            }
          })
          .select('client total_cost')
          .exec()
        ordersOfUser.map((e) => {
          if (e.client == payload.user) {
            daysOrder.push(e)
          }
        })
        orders.push({
          totalSum: daysOrder.reduce(
            (accumlator: any, current: any) => accumlator + current.total_cost,
            0
          )
        })
      })
    )

    return {
      user: {
        fullName: `${user.first_name} ${user.last_name}`,
        phoneNumber: user.phone_number
      },
      data: orders
    }
  }
  /*
    - Top most purchase users     // 10 *daily
    - Top sold products / food    // 10 *daily
    - Total order amount by Org   // *daily
    - Total sum of orders by org  // *daily
  */
}
