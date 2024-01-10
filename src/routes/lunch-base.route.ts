import { Router } from 'express'
import LunchBaseController from '../controllers/lunch-base.controller'

export class LunchBaseRoute {
  public path = '/lunch-base'
  public lunchBaseController = new LunchBaseController()
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      this.lunchBaseController.lunchBaseRetrieveAll,
    )
    this.router.get(
      `${this.path}/lunches/:base`,
      this.lunchBaseController.retrieveBase,
    )
    this.router.post(`${this.path}`, this.lunchBaseController.lunchBaseCreate)
    this.router.get(`${this.path}/:lunch`, this.lunchBaseController.getByBase)
  }
}
