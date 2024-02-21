import { Router } from 'express'
import { AuthController } from '@controllers'

export class AuthRoute {
  public path = '/auth'
  public router = Router()
  public authController = new AuthController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.authController.LoginSuperAdmin)
    this.router.post(`${this.path}/login`, this.authController.loginAdmin)
  }
}
