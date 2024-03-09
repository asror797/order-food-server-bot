import { Router } from 'express'
import { PaymentController } from '@controllers'
import { checkPermission } from '@middlewares'
import { PaymentPermissions } from '@constants'

export class PaymentRoute {
  public path: string = '/payment'
  public router = Router()
  public paymentController = new PaymentController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(PaymentPermissions.PAYMENT_RETRIEVE_ALL),
      this.paymentController.paymentRetrieveAll
    )

    this.router.get(
      `${this.path}`,
      checkPermission(PaymentPermissions.PAYMENT_RETRIEVE_ONE),
      this.paymentController.paymentRetrieveOne
    )

    this.router.post(
      `${this.path}`,
      checkPermission(PaymentPermissions.PAYMENT_CREATE),
      this.paymentController.paymentCreate
    )

    this.router.get(
      `${this.path}`,
      checkPermission(PaymentPermissions.PAYMENT_UPDATE),
      this.paymentController.paymentUpdate
    )

    this.router.get(
      `${this.path}`,
      checkPermission(PaymentPermissions.PAYMENT_DELETE),
      this.paymentController.paymentDelete
    )

    this.router.get(`${this.path}`, this.paymentController.paymentRetrieveAll)
    this.router.get(
      `${this.path}/spents`,
      this.paymentController.paymentDelete
    )
  }
}
