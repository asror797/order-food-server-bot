import { Router } from "express"
import LunchController from "../controllers/lunch.controller"

class LunchRoute {
  public path = '/lunch'
  public router = Router()
  public lunchController = new LunchController();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.lunchController.getLunch)
    this.router.get(`${this.path}/:base`,this.lunchController.getByBase)
    this.router.post(`${this.path}`,this.lunchController.createLunch)
    this.router.delete(`${this.path}/:id`,this.lunchController.deleteLunch)
  }
}

export default LunchRoute;