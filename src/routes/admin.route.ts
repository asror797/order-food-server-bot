import { Router } from 'express'
import AdminController from '../controllers/admin.controller'

export class AdminRoute {
  public path = '/admin'
  public router = Router()
  public adminController = new AdminController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.adminController.getAdmins)
    this.router.post(`${this.path}`, this.adminController.createAdmin)
    this.router.post(`${this.path}/create`,this.adminController.create)
    this.router.post(`${this.path}/login`, this.adminController.loginAdmin)
    this.router.patch(`${this.path}/:admin`, this.adminController.updateAdmin)
    this.router.patch(`${this.path}/:id`,this.adminController.updateAdminRole)
    this.router.delete(`${this.path}/:id`,this.adminController.deleteAdmin)
  }
}
