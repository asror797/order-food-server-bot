import { Router } from 'express'
import { AdminController } from '@controllers'
import { checkPermission } from '@middlewares'
import { AdminPermissions } from '@constants'

export class AdminRoute {
  public path = '/admin'
  public router = Router()
  public adminController = new AdminController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(AdminPermissions.ADMIN_RETRIEVE_ALL),
      this.adminController.adminRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(AdminPermissions.ADMIN_RETRIEVE_ONE),
      this.adminController.adminRetrieveOne
    )

    this.router.post(
      `${this.path}`,
      checkPermission(AdminPermissions.ADMIN_CREATE),
      this.adminController.adminCreate
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(AdminPermissions.ADMIN_UPDATE),
      this.adminController.adminUpdate
    )

    this.router.delete(
      `${this.path}/:id`,
      checkPermission(AdminPermissions.ADMIN_DELETE),
      this.adminController.adminDelete
    )
  }
}
