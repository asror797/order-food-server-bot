import { Router } from 'express'
import LunchBaseController from '../controllers/lunch-base.controller'
import { checkPermission } from 'middlewares'
import { LunchBasePermissions } from './../constants'

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
      checkPermission(LunchBasePermissions.LUNCH_BASE_RETRIEVE_ALL),
      this.lunchBaseController.lunchBaseRetrieveAll
    )

    this.router.get(
      '',
      checkPermission(LunchBasePermissions.LUNCH_BASE_RETRIEVE_ONE),
      this.lunchBaseController.lunchBaseRetrieveOne
    )

    this.router.get(
      '',
      checkPermission(LunchBasePermissions.LUNCH_BASE_CREATE),
      this.lunchBaseController.lunchBaseCreate
    )

    this.router.get(
      '',
      checkPermission(LunchBasePermissions.LUNCH_BASE_UPDATE),
      this.lunchBaseController.lunchBaseUpdate
    )

    this.router.get(
      '',
      checkPermission(LunchBasePermissions.LUNCH_BASE_DELETE),
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
