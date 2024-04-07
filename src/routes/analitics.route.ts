import { AnaliticsController } from '@controllers'
import { Router } from 'express'

export class AnaliticsRoute {
  public router = Router()
  public path = '/analitics'
  public analiticsController = new AnaliticsController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/user/:id`,this.analiticsController.getUserMonthlyAnalitics)
  }
}
