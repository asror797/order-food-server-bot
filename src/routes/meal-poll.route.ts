import { Router } from 'express'
import { MealPollController } from '@controllers'
import { checkPermission } from '@middlewares'
import { OrgPermissions } from '@constants'

export class MealPollRoute {
  public path = '/meal-poll'
  public router = Router()
  public mealpollController = new MealPollController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(OrgPermissions.ORG_RETRIEVE_ALL),
      this.mealpollController.mealpollRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(OrgPermissions.ORG_RETRIEVE_ONE),
      this.mealpollController.mealpollRetrieveOne
    )
  }
}
