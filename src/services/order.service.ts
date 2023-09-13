import { CreateOrderDto } from "../dtos/order.dto";
import { httException } from "../exceptions/httpException";
import foodModel from "../models/food.model";
import orderModel from "../models/order.model";



class OrderService {
  public orders = orderModel;
  public foods = foodModel;

  public async getOrders(page:number , size:number) {
    const skip = (page - 1) * size

    const orders = await this.orders.find()
              .select('-updatedAt')
              .skip(skip)
              .limit(size)
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
    const { client , page , size } = orderData;
  }

  public async createOrder(orderData:CreateOrderDto) {
    const { foods , client , org } = orderData;

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

    return newOrder;
  }
}

export default OrderService;