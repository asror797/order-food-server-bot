import { Router } from 'express'
import LunchController from '../controllers/lunch.controller'
import { checkPermission } from '@middlewares'
import { LunchPermissions } from '@constants'

export class LunchRoute {
  public path = '/lunch'
  public router = Router()
  public lunchController = new LunchController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      '',
      checkPermission(LunchPermissions.LUNCH_RETRIEVE_ALL),
      this.lunchController.lunchRetrieveAll
    )

    this.router.get(
      '',
      checkPermission(LunchPermissions.LUNCH_RETRIEVE_ONE),
      this.lunchController.lunchRetrieveOne
    )

    this.router.post(
      '',
      checkPermission(LunchPermissions.LUNCH_CREATE),
      this.lunchController.lunchCreate
    )

    this.router.patch(
      '',
      checkPermission(LunchPermissions.LUNCH_UPDATE),
      this.lunchController.lunchUpdate
    )

    this.router.delete(
      '',
      checkPermission(LunchPermissions.LUNCH_DELETE),
      this.lunchController.lunchDelete
    )

    this.router.get(`${this.path}`, this.lunchController.getLunch)
    this.router.get(`${this.path}/:base`, this.lunchController.getByBase)
    this.router.get(
      `${this.path}/products/:lunch`,
      this.lunchController.getById
    )
    this.router.post(`${this.path}/:base`, this.lunchController.createLunch)
    this.router.post(
      `${this.path}/product/:lunch`,
      this.lunchController.pushProduct
    )
    this.router.patch(
      `${this.path}/product/:lunch`,
      this.lunchController.updateProducts
    )
    this.router.patch(
      `${this.path}/update/:lunch`,
      this.lunchController.updateLunch
    )
    this.router.patch(
      `${this.path}/products/update/:lunch`,
      this.lunchController.fullUpdateProducts
    )
    this.router.delete(
      `${this.path}/:lunchId/products/:productId`,
      this.lunchController.deleteProducts
    )
    this.router.delete(`${this.path}/:id`, this.lunchController.deleteLunch)
    this.router.patch(`${this.path}/:id`, this.lunchController.toggleStatus)
  }
}
