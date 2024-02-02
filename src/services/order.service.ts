import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns'
import {
  CreateOrderDto,
  OrderRetrieveAllDto,
  OrderRetrieveByUserDto,
  UpdateOrder,
} from '../dtos/order.dto'
import { foodModel, orderModel, userModel } from '@models'
import { HttpException } from '@exceptions'
import { PaymentService, FoodService } from '@services'
import { uz } from 'date-fns/locale'

export class OrderService {
  public orders = orderModel
  public foods = foodModel
  public users = userModel
  public paymentService = new PaymentService()
  public foodService = new FoodService()

  public async getOrders(page: number, size: number) {
    const skip = (page - 1) * size

    const orderWithStatus: any = []

    const orders = await this.orders
      .find()
      .select('-updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .populate('client', 'first_name last_name')
      .populate('org', 'name_org')
      .populate('foods.food', 'name cost')
      .exec()
    const totalOrders = await this.orders.countDocuments().exec()
    const totalPages = Math.ceil(totalOrders / size)

    orders.map((e) => {
      // accepted
      const newObj = e.toJSON()
      if (e.is_accepted == true && e.is_canceled == false) {
        orderWithStatus.push({
          ...newObj,
          status: 'accepted',
        })
        // canceled
      } else if (e.is_accepted == false && e.is_canceled == true) {
        orderWithStatus.push({
          ...newObj,
          status: 'canceled',
        })
        // pending
      } else {
        orderWithStatus.push({
          ...newObj,
          status: 'pending',
        })
      }
    })
    return {
      data: orderWithStatus,
      currentPage: page,
      totalPages,
      totalOrders,
      ordersOnPage: orders.length,
    }
  }

  public async getOrderForBot(orderData: any) {
    const { client, page } = orderData
    const skip = (page - 1) * 10
    const Orders = await this.orders
      .find({
        client: client,
      })
      .select('-updatedAt')
      .skip(skip)
      .limit(10)
      .populate('foods.food', 'name cost')
      .exec()
    console.log(Orders)

    return Orders
  }

  public async getByUser(payload: OrderRetrieveByUserDto) {
    const { id, size, page } = payload
    const orderWithStatus: any = []
    const skip = (page - 1) * size

    const user = await this.users.findById(id)

    if (!user) throw new HttpException(400, 'user not found')

    const orders = await this.orders
      .find({
        client: id,
      })
      .select('-updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .populate('client', 'first_name last_name')
      .populate('org', 'name_org')
      .populate('foods.food', 'name cost')
      .exec()

    const totalOrders = await this.orders.countDocuments({ client: id }).exec()
    const totalPages = Math.ceil(totalOrders / size)

    orders.map((e) => {
      // accepted
      const newObj = e.toJSON()
      if (e.is_accepted == true && e.is_canceled == false) {
        orderWithStatus.push({
          ...newObj,
          status: 'accepted',
        })
        // canceled
      } else if (e.is_accepted == false && e.is_canceled == true) {
        orderWithStatus.push({
          ...newObj,
          status: 'canceled',
        })
        // pending
      } else {
        orderWithStatus.push({
          ...newObj,
          status: 'pending',
        })
      }
    })

    return {
      data: orderWithStatus,
      currentPage: page,
      totalPages,
      totalOrders,
      ordersOnPage: orders.length,
    }
  }

  public async createOrder(orderData: CreateOrderDto) {
    const { foods, client, org } = orderData

    const Client = await this.users.findById(client)

    if (!Client) throw new HttpException(400, 'client not found')

    const foodObjects = []
    let total_cost: number = 0

    for (const { food, amount } of foods) {
      const isExist = await this.foods.findById(food)

      if (!isExist) throw new HttpException(400, `This food ${food} not found`)

      foodObjects.push({ food: isExist['_id'], amount: amount })
      total_cost = total_cost + isExist.cost * amount
    }

    const newOrder = await this.orders.create({
      client,
      org,
      total_cost,
      foods: foodObjects,
    })

    const Order = await this.orders
      .findById(newOrder['_id'])
      .populate('foods.food', 'name cost')

    return Order
  }

  public async acceptOrder(orderData: UpdateOrder) {
    const { order } = orderData

    const Order = await this.orders.findById(order)
    if (!Order) throw new HttpException(400, 'order not found')

    const User = await this.users.findById(Order.client)
    if (!User) throw new HttpException(400, 'client id not found')

    if (Order.is_canceled == true) {
      return {
        message: 'cancelled'
      }
    } else if(User.balance < Order.total_cost) {
      return {
        message: 'InfluenceBalance'
      }
    } else {
      const updatedOrder = await this.orders.findByIdAndUpdate(
        order,
        {
          is_accepted: true,
        },
        { new: true },
      )
  
      if (!updatedOrder) throw new HttpException(400, 'something went wrong')
  
      const updatedUser = await this.paymentService.dicrease({
        amount: updatedOrder?.total_cost,
        user: updatedOrder?.client,
        org: updatedOrder.org
      })
  
      if (!updatedUser) throw new HttpException(400, 'something wnet wrong')
  
      const populatedOrder = (await this.orders
        .findById(updatedOrder['_id'])
        .populate('client', 'first_name last_name telegram_id phone_number')
        .populate('foods.food', 'name cost')
        .populate('org', 'name_org group_a_id group_b_id')) || { foods: [] }
  
      for (let i = 0; i < populatedOrder.foods.length; i++) {
        const { food, amount } = populatedOrder.foods[i]
        await this.foodService.DecreaseProductsOfFood({
          amount: amount,
          food: food,
        })
      }
      console.log('Order', populatedOrder)
      return populatedOrder
    }
  }

  public async cancelOrder(orderData: UpdateOrder) {
    const { order } = orderData

    const Order = await this.orders.findById(order)

    if (!Order) throw new HttpException(400, 'order not found')

    const updatedOrder = await this.orders.findByIdAndUpdate(
      order,
      {
        is_canceled: true,
      },
      { new: true },
    )

    if (!updatedOrder) throw new HttpException(200, 'not found')
    const populatedOrder = await this.orders
      .findById(updatedOrder['_id'])
      .populate('client', 'first_name last_name telegram_id phone_number')
      .populate('foods.food', 'name cost')
      .populate('org', 'name_org group_a_id group_b_id')
    console.log('Order', populatedOrder)
    return populatedOrder
  }

  // public async getTotalOrderCount() {
  // const startDate = new Date(
  //   startOfWeek(new Date(), { weekStartsOn: 1 }).setHours(
  //     startOfWeek(new Date(), { weekStartsOn: 1 }).getHours() + 5,
  //   ),
  // )
  // const endDate = new Date(
  //   endOfWeek(new Date(), { weekStartsOn: 1 }).setHours(
  //     endOfWeek(new Date(), { weekStartsOn: 1 }).getHours() + 5,
  //   ),
  // )

  // const WeeklyOrders = await this.orders.find({
  //   createdAt: {
  //     $gte: startDate,
  //     $lt: endDate,
  //   },
  // })
  // }

  public async getTotalSpent(payload: OrderRetrieveAllDto) {
    const { user, type } = payload

    const User = await this.users
      .findById(user)
      .populate('org', 'name_org')
      .select('first_name last_name phone_number')
      .exec()
    if (!User) throw new HttpException(400, 'user not found')

    const response: any = []

    if (type == 'day') {
      const daysOfWeek = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
      })
      await Promise.all(
        daysOfWeek.map(async (day) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfDay(day),
                $lte: endOfDay(day),
              },
            })
            .select('total_cost')
          response.push({
            label: format(day, 'eeee', { locale: uz }),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0),
          })
        }),
      )
    }

    if (type == 'week') {
      const weekOfMonth = eachWeekOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      })

      await Promise.all(
        weekOfMonth.map(async (week) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfWeek(week),
                $lte: endOfWeek(week),
              },
            })
            .select('total_cost')

          console.log(week)
          response.push({
            label: format(week, 'd MMMM'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0),
          })
        }),
      )
    }

    if (type == 'month') {
      const monthOfYear = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      })

      await Promise.all(
        monthOfYear.map(async (month) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfMonth(month),
                $lte: endOfMonth(month),
              },
            })
            .select('total_cost')
          response.push({
            label: format(month, 'd MMMM'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0),
          })
        }),
      )
    }

    return {
      user: User,
      data: response,
    }
  }

  public async getOldAnaltics(payload: OrderRetrieveAllDto) {
    const { user, type } = payload

    const User = await this.users
      .findById(user)
      .populate('org', 'name_org')
      .select('first_name last_name phone_number')
      .exec()
    if (!User) throw new HttpException(400, 'user not found')

    const response: any = []

    if (type == 'day') {
      const daysOfWeek = eachDayOfInterval({
        start: startOfWeek(new Date(2023, 11, 29), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(2023, 11, 29), { weekStartsOn: 1 }),
      })
      await Promise.all(
        daysOfWeek.map(async (day) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfDay(day),
                $lte: endOfDay(day),
              },
            })
            .select('total_cost')
          response.push({
            label: format(day, 'eeee yyyy', { locale: uz }),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0),
          })
        }),
      )
    }

    if (type == 'week') {
      const weekOfMonth = eachWeekOfInterval({
        start: startOfMonth(new Date(2023, 11, 29)),
        end: endOfMonth(new Date(2023, 11, 29)),
      })

      await Promise.all(
        weekOfMonth.map(async (week) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfWeek(week),
                $lte: endOfWeek(week),
              },
            })
            .select('total_cost')

          console.log(week)
          response.push({
            label: format(week, 'd MMMM yyyy'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0),
          })
        }),
      )
    }

    if (type == 'month') {
      const monthOfYear = eachMonthOfInterval({
        start: startOfYear(new Date(2023, 11, 29)),
        end: endOfYear(new Date(2023, 11, 29)),
      })

      await Promise.all(
        monthOfYear.map(async (month) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfMonth(month),
                $lte: endOfMonth(month),
              },
            })
            .select('total_cost')
          response.push({
            label: format(month, 'MMMM yyyy'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0),
          })
        }),
      )
    }

    return {
      user: User,
      data: response,
    }
  }

  public async orderRetrieveTotalSum(payload: any) {
    const { user } = payload

    const orders = await this.orders.find({
      user: user,
    })

    if (!user) throw new HttpException(400, 'user not found')
    for (let index = 0; index < orders.length; index++) {
      // const element = orders[index]
    }
  }
}

export default OrderService
