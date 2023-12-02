import { Router } from "express";
import ProductController from "../controllers/product.controller";




class ProductRoute {
  public path = '/product'
  public router = Router()
  public productController = new ProductController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.productController.getProducts)
    this.router.post(`${this.path}`,this.productController.createProduct)
    this.router.patch(`${this.path}/amount`,this.productController.editAmountProduct)
    this.router.patch(`${this.path}/update/:product`,this.productController.updateProduct)
  }
}

export default ProductRoute;