import { Router } from 'express'
import AdminController from '../controllers/admin.controller'
import { checkPermission } from './../middlewares'

export class AdminRoute {
  public path = '/admin'
  public router = Router()
  public adminController = new AdminController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    /* New Version */
    this.router.get(
      'aass',
      checkPermission('asas'),
      this.adminController.adminRetrieveAll
    )
    this.router.get(
      'admin/:id',
      checkPermission('asas'),
      this.adminController.adminRetrieveOne
    )
    this.router.post(
      'create',
      checkPermission('asas'),
      this.adminController.adminCreate
    )
    this.router.patch(
      'update/:id',
      checkPermission('asas'),
      this.adminController.adminUpdate
    )
    this.router.delete(
      'delelete/:id',
      checkPermission('asas'),
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
