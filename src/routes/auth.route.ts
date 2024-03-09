import { Router } from 'express'
import { AuthController, AnaliticsController } from '@controllers'

export class AuthRoute {
  public path = '/auth'
  public router = Router()
  public authController = new AuthController()
  public analiticsController = new AnaliticsController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}`, this.authController.)
    // this.router.post(`${this.path}/login`, this.authController.loginAdmin)
    // this.router.get(`/analit`, this.analiticsController.getPdf)
  }
}
