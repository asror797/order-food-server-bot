import { Router } from 'express'
import PaymentController from '../controllers/payment.controller'

export class PaymentRoute {
  public path: string = '/payment'
  public router = Router()
  public paymentController = new PaymentController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.paymentController.paymentRetrieveAll)
  }
}
