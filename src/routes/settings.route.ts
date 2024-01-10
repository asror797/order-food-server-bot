import { Router } from 'express'
import SettingsController from '../controllers/settings.controller'

export class SettingsRoute {
  public path = '/settings'
  public router = Router()
  public settingsController = new SettingsController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/otp-info`,
      this.settingsController.saveOtpInfo,
    )
  }
}
