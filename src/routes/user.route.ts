import { Router } from 'express'
import { UserController } from '@controllers'
import { checkPermission } from '@middlewares'
import { UserPermissions } from '@constants'

export class UserRoute {
  public path = '/user'
  public router = Router()
  public userController = new UserController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(UserPermissions.USER_RETRIEVE_ALL),
      this.userController.userRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(UserPermissions.USER_RETRIEVE_ONE),
      this.userController.userRetrieveOne
    )

    this.router.post(
      `${this.path}/sendMessage`,
      this.userController.sendMessage
    )

    this.router.patch(
      `${this.path}/balance/:id`,
      checkPermission(UserPermissions.USER_UPDATE),
      this.userController.userUpdateBalance
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(UserPermissions.USER_UPDATE),
      this.userController.userUpdate
    )

    this.router.delete(`${this.path}/:id`, this.userController.userDelete)
  }
}
