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
    this.router.get(`${this.path}/products/:lunch`,this.lunchController.getById)
    this.router.post(`${this.path}/:base`,this.lunchController.createLunch)
    this.router.post(`${this.path}/product/:lunch`,this.lunchController.pushProduct)
    this.router.patch(`${this.path}/product/:lunch`,this.lunchController.updateProducts)
    this.router.patch(`${this.path}/products/update/:lunch`,this.lunchController.fullUpdateProducts)
    this.router.delete(`${this.path}/products/:lunch`,this.lunchController.deleteProducts)
    this.router.delete(`${this.path}/:id`,this.lunchController.deleteLunch)
  }
}

export default LunchRoute;