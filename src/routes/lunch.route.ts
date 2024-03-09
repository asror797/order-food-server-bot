import { Router } from 'express'
import { LunchController } from '@controllers'
import { checkPermission } from '@middlewares'
import { LunchPermissions } from '@constants'

export class LunchRoute {
  public path = '/lunch'
  public router = Router()
  public lunchController = new LunchController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(LunchPermissions.LUNCH_RETRIEVE_ALL),
      this.lunchController.lunchRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(LunchPermissions.LUNCH_RETRIEVE_ONE),
      this.lunchController.lunchRetrieveOne
    )

    this.router.post(
      `${this.path}`,
      checkPermission(LunchPermissions.LUNCH_CREATE),
      this.lunchController.lunchCreate
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(LunchPermissions.LUNCH_UPDATE),
      this.lunchController.lunchCreate
    )

    this.router.delete(
      `${this.path}/:id`,
      checkPermission(LunchPermissions.LUNCH_DELETE),
      this.lunchController.lunchDelete
    )

    this.router.patch(
      `${this.path}/status/:id`,
      this.lunchController.lunchCreate
    )
  }
}
