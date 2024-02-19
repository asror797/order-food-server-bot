import { Router } from 'express'
import OrderController from '../controllers/order.controller'
import { checkPermission } from 'middlewares'

export class OrderRoute {
  public path = '/order'
  public router = Router()
  public orderController = new OrderController()

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(
      'order-retrieve-all',
      checkPermission(''),
      this.orderController.orderRetrieveAll
    )
    this.router.get(
      'order-retrieve-all',
      checkPermission(''),
      this.orderController.orderRetrieveOne
    )
    this.router.get(
      'order-retrieve-one',
      checkPermission(''),
      this.orderController.orderCreate
    )
    this.router.get(
      'order-retrieve',
      checkPermission(''),
      this.orderController.orderUpdate
    )
    this.router.get(
      'order-retrievel',
      checkPermission(''),
      this.orderController.orderDelete
    )

    this.router.get(`${this.path}`, this.orderController.getWithPagination)
    this.router.post(`${this.path}`, this.orderController.createOrder)
    this.router.get(
      `${this.path}/user/:user`,
      this.orderController.getOrderByUser
    )
    this.router.get(
      `${this.path}/spent/:user`,
      this.orderController.getSpentsByUser
    )
    this.router.get(
      `${this.path}/old-analitics/:user`,
      this.orderController.getOldAnalitics
    )
    this.router.get(
      `${this.path}/total-spent`,
      this.orderController.getAllSpentUser
    )
  }
}
