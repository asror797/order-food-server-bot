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
  startOfYear
} from 'date-fns'
// import {
//   CreateOrderDto,
//   OrderRetrieveAllDto,
//   OrderRetrieveByUserDto,
//   UpdateOrder
// } from '../dtos/order.dto'
import { foodModel, orderModel, orgModel, userModel } from '@models'
import { HttpException } from '@exceptions'
import { PaymentService, FoodService } from '@services'
import { uz } from 'date-fns/locale'
import {
  OrderCreateRequest,
  OrderRetrieveAllRequest,
  OrderRetrieveAllResponse
} from '@interfaces'

export class OrderService {
  private orders = orderModel
  private orgs = orgModel
  private foods = foodModel
  private users = userModel
  public paymentService = new PaymentService()
  public foodService = new FoodService()

  public async orderRetrieveAll(
    payload: OrderRetrieveAllRequest
  ): Promise<OrderRetrieveAllResponse> {
    console.log(payload)
    const orderList = await this.orders
      .find()
      .skip((payload.pageNumber - 1) * payload.pageSize)
      .limit(payload.pageSize)
      .sort({ createdAt: -1 })
      .exec()

    const orderCount = await this.orders.countDocuments().exec()
    return {
      count: orderCount,
      pageCount: Math.ceil( orderCount / payload.pageSize),
      pageNumber: payload.pageNumber,
      pageSize: payload.pageSize,
      orderList: []
    }
  }

  public async orderRetrieveOne(payload: { id: string }): Promise<any> {
    const order = await this.orders.findById(payload.id).exec()

    if (!order) throw new HttpException(404, 'Order not found')

    return order
  }

  public async orderCreate(payload: OrderCreateRequest): Promise<any> {
    const user = await this.users.findById(payload.client).select('-createdAt -updatedAt')
    if (!user) throw new HttpException(404, 'User not found')

    const org = await this.orgs
      .findById(payload.org, { is_deleted: false })
      .select('name_org')
      .exec()

    if (!org) throw new HttpException(404, 'Org not found')

    const orderFoods: any = []
    let total_cost: number = 0
    await Promise.all(
      payload.foods.map(async (e) => {
        const food = await this.foods
          .findById(e.food)
          .select('name org cost products')
          .exec()

        if (!food) {
          throw new HttpException(404, 'Food not found')
        }

        if (e.amount <= 0) {
          throw new HttpException(404, 'Food amount not valid')
        }

        orderFoods.push({
          id: food['_id'],
          name: food.name,
          cost: food.cost,
          amount: e.amount
        })
        total_cost += food.cost * e.amount
      })
    )

    if (user.balance >= total_cost) {
      const order: any = await this.orders.create({
        client: user['_id'],
        org: org['_id'],
        foods: orderFoods.map((e: any) => ({ food: e.id, amount: e.amount })),
        total_cost: total_cost
      })
  
      return {
        _id: order['_id'],
        client: user['_id'],
        org: org.name_org,
        foods: orderFoods.map((e: any) => ({
          name: e.name,
          cost: e.cost,
          amount: e.amount
        })),
        is_accepted: false,
        is_canceled: false,
        total_cost: total_cost,
        user: {
          fullname: `${user.first_name} ${user.last_name}`,
          phone_number: user.phone_number
        },
        createdAt: order.createdAt
      }
    } else {
      return {
        isBalanceSufficient: false
      }
    }
  }

  public async orderAccept(payload: { id: string }) {
    await this.orderRetrieveOne(payload)
    /** Order Accept qilganda  mahsulot yechib olsin */
    /** Order Accept qilganda pul yechib olsin */

    return await this.orders.findByIdAndUpdate(payload.id, { is_accepted: true, is_canceled: false })
  }

  public async orderUpdate(payload: any): Promise<any> {
    const updatedOrder = await this.orders.findByIdAndUpdate(payload.id, {
      is_accepted: true,
      is_canceled: false
    })

    return updatedOrder
  }

  public async orderDelete(): Promise<any> {}

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
          status: 'accepted'
        })
        // canceled
      } else if (e.is_accepted == false && e.is_canceled == true) {
        orderWithStatus.push({
          ...newObj,
          status: 'canceled'
        })
        // pending
      } else {
        orderWithStatus.push({
          ...newObj,
          status: 'pending'
        })
      }
    })
    return {
      data: orderWithStatus,
      currentPage: page,
      totalPages,
      totalOrders,
      ordersOnPage: orders.length
    }
  }

  public async getOrderForBot(orderData: any) {
    const { client, page } = orderData
    const skip = (page - 1) * 10
    const Orders = await this.orders
      .find({
        client: client
      })
      .select('-updatedAt')
      .skip(skip)
      .limit(10)
      .populate('foods.food', 'name cost')
      .exec()
    console.log(Orders)

    return Orders
  }

  public async getByUser(payload: any) {
    const { id, size, page } = payload
    const orderWithStatus: any = []
    const skip = (page - 1) * size

    const user = await this.users.findById(id)

    if (!user) throw new HttpException(400, 'user not found')

    const orders = await this.orders
      .find({
        client: id
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
          status: 'accepted'
        })
        // canceled
      } else if (e.is_accepted == false && e.is_canceled == true) {
        orderWithStatus.push({
          ...newObj,
          status: 'canceled'
        })
        // pending
      } else {
        orderWithStatus.push({
          ...newObj,
          status: 'pending'
        })
      }
    })

    return {
      data: orderWithStatus,
      currentPage: page,
      totalPages,
      totalOrders,
      ordersOnPage: orders.length
    }
  }

  public async createOrder(payload: any) {
    const Client = await this.users.findById(payload.client)
    if (!Client) throw new HttpException(400, 'client not found')

    const foodObjects = []
    let total_cost: number = 0

    for (const { food, amount } of payload.foods) {
      const isExist = await this.foods.findById(food)
      if (!isExist) throw new HttpException(400, `This food ${food} not found`)

      foodObjects.push({ food: isExist['_id'], amount: amount })
      total_cost = total_cost + isExist.cost * amount
    }

    const newOrder = await this.orders.create({
      client: payload.client,
      org: payload.org,
      total_cost,
      foods: foodObjects
    })

    const Order = await this.orders
      .findById(newOrder['_id'])
      .populate('foods.food', 'name cost')

    return Order
  }

  public async acceptOrder(orderData: any) {
    const { order } = orderData

    const Order = await this.orders.findById(order)
    if (!Order) throw new HttpException(400, 'order not found')

    const User = await this.users.findById(Order.client)
    if (!User) throw new HttpException(400, 'client id not found')

    if (Order.is_canceled == true) {
      return {
        message: 'cancelled'
      }
    } else if (User.balance < Order.total_cost) {
      return {
        message: 'InfluenceBalance'
      }
    } else {
      const updatedOrder = await this.orders.findByIdAndUpdate(
        order,
        {
          is_accepted: true
        },
        { new: true }
      )

      if (!updatedOrder) throw new HttpException(400, 'something went wrong')

      const populatedOrder = (await this.orders
        .findById(updatedOrder['_id'])
        .populate('client', 'first_name last_name telegram_id phone_number')
        .populate('foods.food', 'name cost')
        .populate('org', 'name_org group_a_id group_b_id')) || { foods: [] }

      for (let i = 0; i < populatedOrder.foods.length; i++) {
        const { food, amount } = populatedOrder.foods[i]
        // await this.foodService.DecreaseProductsOfFood({
        //   amount: amount,
        //   food: food
        // })
      }
      console.log('Order', populatedOrder)
      return populatedOrder
    }
  }

  public async cancelOrder(orderData: any) {
    const { order } = orderData

    const Order = await this.orders.findById(order)

    if (!Order) throw new HttpException(400, 'order not found')

    const updatedOrder = await this.orders.findByIdAndUpdate(
      order,
      {
        is_canceled: true
      },
      { new: true }
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

  public async getTotalSpent(payload: any) {
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
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
      })
      await Promise.all(
        daysOfWeek.map(async (day) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfDay(day),
                $lte: endOfDay(day)
              }
            })
            .select('total_cost')
          response.push({
            label: format(day, 'eeee', { locale: uz }),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0)
          })
        })
      )
    }

    if (type == 'week') {
      const weekOfMonth = eachWeekOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })

      await Promise.all(
        weekOfMonth.map(async (week) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfWeek(week),
                $lte: endOfWeek(week)
              }
            })
            .select('total_cost')

          console.log(week)
          response.push({
            label: format(week, 'd MMMM'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0)
          })
        })
      )
    }

    if (type == 'month') {
      const monthOfYear = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      })

      await Promise.all(
        monthOfYear.map(async (month) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfMonth(month),
                $lte: endOfMonth(month)
              }
            })
            .select('total_cost')
          response.push({
            label: format(month, 'd MMMM'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0)
          })
        })
      )
    }

    return {
      user: User,
      data: response
    }
  }

  public async getSpentMoney(payload: {
    userId: string
    startDate?: string
    endDate?: string
    org?: string
  }) {
    interface IOrg {
      id: string
      name: string
    }

    const options: any = {}

    const UserOrg: IOrg = { id: '', name: '' }
    const User = await this.users.findById(payload.userId).exec()
    if (!User) {
      throw new HttpException(400, 'User not found')
    }

    if (payload.org) {
      const Org = await orgModel.findById(payload.org).exec()
      if (!Org) throw new HttpException(400, 'org not found')
      UserOrg.id = Org['_id']
      UserOrg.name = Org.name_org
      options.org = Org['_id']
    }

    interface Order {
      id: number
      data: any
      label: string
    }
    const allOrders: Order[] = []
    const start = payload.startDate
      ? new Date(payload.startDate)
      : startOfMonth(new Date())
    const end = payload.endDate
      ? new Date(payload.endDate)
      : endOfMonth(new Date())

    const daysOfTimeSequance = eachDayOfInterval({
      start: new Date(start),
      end: new Date(end)
    })

    if (daysOfTimeSequance.length > 62) {
      throw new HttpException(200, 'too long date')
    } else {
      await Promise.all(
        daysOfTimeSequance.map(async (day, i: number) => {
          const orders = await this.orders
            .find({
              ...options,
              client: payload.userId,
              is_accepted: true,
              createdAt: {
                $gte: startOfDay(day),
                $lte: endOfDay(day)
              }
            })
            .select('total_cost')
          allOrders.push({
            id: i,
            data: orders.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.total_cost,
              0
            ),
            label: format(day, 'MMMM d', { locale: uz })
          })
        })
      )

      allOrders.sort((a, b) => a.id - b.id)

      return {
        user: {
          id: User['_id'],
          fullName: `${User.first_name} ${User.last_name}`,
          phoneNumber: User.phone_number
        },
        org: UserOrg,
        data: allOrders
      }
    }
  }

  public async getOldAnaltics(payload: any) {
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
        end: endOfWeek(new Date(2023, 11, 29), { weekStartsOn: 1 })
      })
      await Promise.all(
        daysOfWeek.map(async (day) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfDay(day),
                $lte: endOfDay(day)
              }
            })
            .select('total_cost')
          response.push({
            label: format(day, 'eeee yyyy', { locale: uz }),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0)
          })
        })
      )
    }

    if (type == 'week') {
      const weekOfMonth = eachWeekOfInterval({
        start: startOfMonth(new Date(2023, 11, 29)),
        end: endOfMonth(new Date(2023, 11, 29))
      })

      await Promise.all(
        weekOfMonth.map(async (week) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfWeek(week),
                $lte: endOfWeek(week)
              }
            })
            .select('total_cost')

          console.log(week)
          response.push({
            label: format(week, 'd MMMM yyyy'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0)
          })
        })
      )
    }

    if (type == 'month') {
      const monthOfYear = eachMonthOfInterval({
        start: startOfYear(new Date(2023, 11, 29)),
        end: endOfYear(new Date(2023, 11, 29))
      })

      await Promise.all(
        monthOfYear.map(async (month) => {
          const orders = await this.orders
            .find({
              client: user,
              is_accepted: true,
              createdAt: {
                $gte: startOfMonth(month),
                $lte: endOfMonth(month)
              }
            })
            .select('total_cost')
          response.push({
            label: format(month, 'MMMM yyyy'),
            data: orders.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total_cost
            }, 0)
          })
        })
      )
    }

    return {
      user: User,
      data: response
    }
  }

  public async orderRetrieveTotalSum(payload: any) {
    const { user } = payload

    const orders = await this.orders.find({
      user: user
    })

    if (!user) throw new HttpException(400, 'user not found')
    for (let index = 0; index < orders.length; index++) {
      // const element = orders[index]
    }
  }
}

export default OrderService
