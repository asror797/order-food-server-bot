import { Router } from 'express'
import { FoodController } from '@controllers'
import { checkPermission } from '@middlewares'
import { FoodPermissions } from '@constants'

export class FoodRoute {
  public path = '/food'
  public router = Router()
  public foodController = new FoodController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(FoodPermissions.FOOD_RETRIEVE_ALL),
      this.foodController.foodRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(FoodPermissions.FOOD_RETRIEVE_ONE),
      this.foodController.foodRetrieveOne
    )

    this.router.post(
      `${this.path}`,
      checkPermission(FoodPermissions.FOOD_CREATE),
      this.foodController.foodCreate
    )

    this.router.patch(
      `${this.path}`,
      checkPermission(FoodPermissions.FOOD_UPDATE),
      this.foodController.foodUpdate
    )

    this.router.delete(
      `${this.path}/:id`,
      checkPermission(FoodPermissions.FOOD_DELETE),
      this.foodController.foodDelete
    )
  }
}
