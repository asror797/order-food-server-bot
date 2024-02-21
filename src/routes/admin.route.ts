import { Router } from 'express'
import AdminController from '../controllers/admin.controller'
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
      'aass',
      checkPermission(AdminPermissions.ADMIN_RETRIEVE_ALL),
      this.adminController.adminRetrieveAll
    )

    this.router.get(
      'admin/:id',
      checkPermission(AdminPermissions.ADMIN_RETRIEVE_ONE),
      this.adminController.adminRetrieveOne
    )

    this.router.post(
      'create',
      checkPermission(AdminPermissions.ADMIN_CREATE),
      this.adminController.adminCreate
    )

    this.router.patch(
      'update/:id',
      checkPermission(AdminPermissions.ADMIN_UPDATE),
      this.adminController.adminUpdate
    )

    this.router.delete(
      'delelete/:id',
      checkPermission(AdminPermissions.ADMIN_DELETE),
      this.adminController.adminUpdate
    )

    this.router.get(`${this.path}`, this.adminController.getAdmins)
    this.router.post(`${this.path}`, this.adminController.createAdmin)
    this.router.post(`${this.path}/create`, this.adminController.create)
    this.router.post(`${this.path}/login`, this.adminController.loginAdmin)
    this.router.patch(`${this.path}/:admin`, this.adminController.updateAdmin)
    this.router.patch(`${this.path}/:id`, this.adminController.updateAdminRole)
    this.router.delete(`${this.path}/:id`, this.adminController.deleteAdmin)
  }
}
