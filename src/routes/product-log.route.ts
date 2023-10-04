import { Router } from "express";
import ProductLogController from './../controllers/product-log.controller'



class ProductLogRoute {
  public path = '/product-log'
  public router = Router()
  public productController = new ProductLogController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.productController.getLogs)
  }
}

export default ProductLogRoute;