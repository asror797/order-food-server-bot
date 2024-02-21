import { Router } from 'express'
import OrderController from '../controllers/order.controller'
import { checkPermission } from 'middlewares'
import { OrderPermissions } from './../constants'

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
      checkPermission(OrderPermissions.ORDER_RETRIEVE_ALL),
      this.orderController.orderRetrieveAll
    )

    this.router.get(
      'order-retrieve-all',
      checkPermission(OrderPermissions.ORDER_RETRIEVE_ONE),
      this.orderController.orderRetrieveOne
    )

    this.router.post(
      'order-retrieve-one',
      checkPermission(OrderPermissions.ORDER_CREATE),
      this.orderController.orderCreate
    )

    this.router.patch(
      'order-retrieve',
      checkPermission(OrderPermissions.ORDER_UPDATE),
      this.orderController.orderUpdate
    )

    this.router.delete(
      'order-retrievel',
      checkPermission(OrderPermissions.ORDER_DELETE),
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
