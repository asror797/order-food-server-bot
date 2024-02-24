import { Router } from 'express'
import { RoleController } from '@controllers'
import { checkPermission } from '@middlewares'
import { RolePermissions } from '@constants'

export class RoleRoute {
  public path = '/role'
  public router = Router()
  public roleController = new RoleController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(RolePermissions.ROLE_RETRIEVE_ALL),
      this.roleController.roleRetrieveAll
    )
    this.router.post(
      `${this.path}`,
      checkPermission(RolePermissions.ROLE_CREATE),
      this.roleController.createRole
    )
    this.router.post(
      `${this.path}/module`,
      checkPermission(RolePermissions.ROLE_MODULE_CREATE),
      this.roleController.addModule
    )
    this.router.patch(
      `${this.path}/module`,
      checkPermission(RolePermissions.ROLE_MODULE_UPDATE),
      this.roleController.updateModule
    )
    this.router.post(
      `${this.path}/module/delete`,
      checkPermission(RolePermissions.ROLE_MODULE_DELETE),
      this.roleController.deleteModule
    )
    this.router.patch(
      `${this.path}/module/toggle`,
      checkPermission(RolePermissions.ROLE_MODULE_UPDATE),
      this.roleController.toggleModule
    )

    this.router.post(
      `${this.path}/action`,
      checkPermission(RolePermissions.ROLE_ACTION_CREATE),
      this.roleController.addAction
    )
    this.router.patch(
      `${this.path}/action`,
      checkPermission(RolePermissions.ROLE_ACTION_UPDATE),
      this.roleController.updateAction
    )
    this.router.post(
      `${this.path}/action/delete`,
      checkPermission(RolePermissions.ROLE_ACTION_UPDATE),
      this.roleController.deleteAction
    )
    this.router.patch(
      `${this.path}/action/toggle`,
      checkPermission(RolePermissions.ROLE_ACTION_UPDATE),
      this.roleController.toggleAction
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(RolePermissions.ROLE_UPDATE),
      this.roleController.updateRole
    )
    this.router.delete(
      `${this.path}/:id`,
      checkPermission(RolePermissions.ROLE_DELETE),
      this.roleController.deleteRole
    )
  }
}
