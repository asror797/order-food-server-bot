import { Router } from 'express'
import LunchBaseController from '../controllers/lunch-base.controller'
import { checkPermission } from 'middlewares'

export class LunchBaseRoute {
  public path = '/lunch-base'
  public lunchBaseController = new LunchBaseController()
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      '',
      checkPermission('s'),
      this.lunchBaseController.lunchBaseRetrieveAll
    )

    this.router.get(
      '',
      checkPermission('s'),
      this.lunchBaseController.lunchBaseRetrieveOne
    )
    this.router.get(
      '',
      checkPermission('s'),
      this.lunchBaseController.lunchBaseCreate
    )
    this.router.get(
      '',
      checkPermission('s'),
      this.lunchBaseController.lunchBaseUpdate
    )
    this.router.get(
      '',
      checkPermission('s'),
      this.lunchBaseController.lunchBaseDelete
    )

    /* */
    this.router.get(
      `${this.path}`,
      this.lunchBaseController.lunchBaseRetrieveAll
    )
    this.router.get(
      `${this.path}/lunches/:base`,
      this.lunchBaseController.retrieveBase
    )
    this.router.post(`${this.path}`, this.lunchBaseController.lunchBaseCreate)
    this.router.get(`${this.path}/:lunch`, this.lunchBaseController.getByBase)
    this.router.patch(
      `${this.path}/:id`,
      this.lunchBaseController.toggleStatusBase
    )
  }
}
