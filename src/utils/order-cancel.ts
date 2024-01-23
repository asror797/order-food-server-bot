import { orderModel } from "@models";

export async function autoCancelOrder() {
  try {
    const expiredOrders = await orderModel.find({
      is_canceled: false,
      createdAt: { $lt: new Date(Date.now() - 25 * 60 * 1000) },
    }).select('is_canceled').exec()


    if(expiredOrders.length > 0) {
      await orderModel.updateMany(
        { _id: { $in: expiredOrders.map(order => order._id) } },
        { $set: { is_canceled: true } }
      )
    }
    console.log(expiredOrders)
  } catch (error) {
    console.log(error)
  }
}
