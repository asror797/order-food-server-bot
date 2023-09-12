import { CreateOrderDto } from "../dtos/order.dto";
import { httException } from "../exceptions/httpException";
import foodModel from "../models/food.model";
import orderModel from "../models/order.model";



class OrderService {
  public orders = orderModel;
  public foods = foodModel;

  public async getOrders() {
    return await this.orders.find().exec()
  }

  public async getOrderForBot() {
    
  }

  public async createOrder(orderData:CreateOrderDto) {
    const { foods , client , org } = orderData;

    const foodObjects = []
    let total_cost: number = 0

    for (const { food , amount } of foods) {
      const isExist = await this.foods.findById(food)

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