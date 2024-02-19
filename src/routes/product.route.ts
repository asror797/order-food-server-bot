import { Router } from 'express'
import ProductController from '../controllers/product.controller'
import { checkPermission } from 'middlewares'
import { ProductPermissions } from './../constants'

export class ProductRoute {
  public path = '/product'
  public router = Router()
  public productController = new ProductController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      'product/retrieve-all',
      checkPermission(ProductPermissions.PRODUCT_RETRIEVE_ALL),
      this.productController.ProductRetrieveAll
    )
    this.router.get(
      'product',
      checkPermission(ProductPermissions.PRODUCT_RETRIEVE_ONE),
      this.productController.ProductRetrieveOne
    )
    this.router.get(`${this.path}`, this.productController.getProducts)
    this.router.post(`${this.path}`, this.productController.createProduct)
    this.router.patch(
      `${this.path}/amount`,
      this.productController.editAmountProduct
    )
    this.router.patch(
      `${this.path}/update/:product`,
      this.productController.updateProduct
    )
  }
}
