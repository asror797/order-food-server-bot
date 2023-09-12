import { Router } from "express"
import OrderController from "../controllers/order.controller"


class OrderRoute {
  public path = '/order'
  public router = Router()
  public orderController = new OrderController()

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(`${this.path}`,this.orderController.getWithPagination)
    this.router.post(`${this.path}`,this.orderController.createOrder)
  }
}


export default OrderRoute;