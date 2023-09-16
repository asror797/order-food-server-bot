import { CreateOrderDto, UpdateOrder } from "../dtos/order.dto";
import { httException } from "../exceptions/httpException";
import foodModel from "../models/food.model";
import orderModel from "../models/order.model";
import userModel from "../models/user.model";
import PaymentService from "./payment.service";



class OrderService {
  public orders = orderModel;
  public foods = foodModel;
  public users = userModel;
  public paymentService = new PaymentService();

  public async getOrders(page:number , size:number) {
    const skip = (page - 1) * size

    const orders = await this.orders.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
              .populate('client','first_name last_name')
              .populate('org','name_org')
              .populate('foods.food','name cost')
              .exec();
    const totalorders = await this.orders.countDocuments().exec()
    const totalPages = Math.ceil(totalorders / size)
    return {
      data: orders,
      currentPage: page,
      totalPages,
      totalorders,
      productsOnPage: orders.length
    };
  }

  public async getOrderForBot(orderData:any) {
    const { client , page  } = orderData;
    const skip = (page - 1) * 10;
    const Orders = await this.orders.find({
      client: client
    }).select('-updatedAt').skip(skip).limit(10).populate('foods.food','name cost').exec();
    console.log(Orders)

    return Orders;
  }

  public async createOrder(orderData:CreateOrderDto) {
    const { foods , client , org } = orderData;

    const Client = await this.users.findById(client);

    if(!Client) throw new httException(400,'client not found');

    const foodObjects = []
    let total_cost: number = 0

    for (const { food , amount } of foods) {
      const isExist = await this.foods.findById(food);

      if(!isExist) throw new httException(400,`This food ${food} not found`);

      foodObjects.push({ food: isExist['_id'] , amount: amount })
      total_cost = total_cost + isExist.cost * amount
    }

    const newOrder = await this.orders.create({
      client,
      org,
      total_cost,
      foods: foodObjects
    });

    const Order = await this.orders.findById(newOrder['_id']).populate('foods.food','name cost')

    return Order;
  }

  public async acceptOrder(orderData:UpdateOrder) {
    const { order } = orderData;

    const Order = await this.orders.findById(order);

    if(!Order) throw new httException(400,'order not found');

    const updatedOrder = await this.orders.findByIdAndUpdate(order,{
      is_accepted: true
    },{ new: true });

    if(!updatedOrder) throw new httException(400,'something went wrong')
    const updatedUser = await this.paymentService.dicrease({amount: updatedOrder?.total_cost , user: updatedOrder?.client });

    if(!updatedUser) throw new httException(400,'something wnet wrong')

    return updatedOrder;
  }

  public async cancelOrder(orderData:UpdateOrder) {
    const { order } = orderData;

    const Order = await this.orders.findById(order);

    if(!Order) throw new httException(400,'order not found');

    const updatedOrder = await this.orders.findByIdAndUpdate(order,{
      is_canceled: true
    },{ new: true });

    return updatedOrder;
  }
}

export default OrderService;