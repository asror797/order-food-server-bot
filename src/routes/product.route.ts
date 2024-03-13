import { Router } from 'express'
import { ProductController } from '@controllers'
import { checkPermission } from '@middlewares'
import { ProductPermissions } from '@constants'

export class ProductRoute {
  public path = '/product'
  public router = Router()
  public productController = new ProductController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(ProductPermissions.PRODUCT_RETRIEVE_ALL),
      this.productController.productRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(ProductPermissions.PRODUCT_RETRIEVE_ONE),
      this.productController.productRetrieveOne
    )

    this.router.post(
      `${this.path}`,
      checkPermission(ProductPermissions.PRODUCT_CREATE),
      this.productController.productCreate
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(ProductPermissions.PRODUCT_UPDATE),
      this.productController.productUpdate
    )

    this.router.delete(
      `${this.path}/:id`,
      checkPermission(ProductPermissions.PRODUCT_DELETE),
      this.productController.productDelete
    )
  }
}
