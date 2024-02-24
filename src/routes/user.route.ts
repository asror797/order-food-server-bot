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
      checkPermission(UserPermissions.USER_RETRIEVE_ONE)
    )

    this.router.post(
      `${this.path}`,
      checkPermission(UserPermissions.USER_CREATE),
      this.userController.createUser
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(UserPermissions.USER_UPDATE),
      this.userController.editUser
    )

    this.router.get(`${this.path}/search`, this.userController.SearchUser)
    this.router.get(
      `${this.path}/telegram/:telegramid`,
      this.userController.findUser
    )
    this.router.put(
      `${this.path}/status/:user`,
      this.userController.updateStatus
    )
    this.router.put(`${this.path}/`, this.userController.updateInfoUser)
    this.router.put(`${this.path}/verify/:user`, this.userController.verifyUser)
    this.router.post(
      `${this.path}/send-message`,
      this.userController.sendMessage
    )
    this.router.put(`${this.path}/org/:user`, this.userController.updateOrg)
    this.router.patch(`${this.path}/payment`, this.userController.payment)
    this.router.patch(`${this.path}/role`, this.userController.updateUserRole)
    this.router.patch(`${this.path}/edit-info`, this.userController.editUser)
  }
}
