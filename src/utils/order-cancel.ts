import { orderModel } from "@models";
import { botService } from '@bot'

export async function autoCancelOrder() {
  try {
    const expiredOrders = await orderModel.find({
      is_canceled: false,
      createdAt: { $lt: new Date(Date.now() - 20 * 60 * 1000) },
    }).select('is_canceled').populate('client','telegram_id').exec()


    if(expiredOrders.length > 0) {
      await orderModel.updateMany(
        { _id: { $in: expiredOrders.map(order => order._id) } },
        { $set: { is_canceled: true } }
      )

      try {
        expiredOrders.map((e:any) => {
          if(e.client && e.client.telegram_id) {
            botService.sendText(e.client.telegram_id,'Buyurtma bekor qilindi')
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
    console.log(expiredOrders)
  } catch (error) {
    console.log(error)
  }
}
