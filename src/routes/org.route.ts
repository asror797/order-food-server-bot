import { Router } from 'express'
import OrgController from '../controllers/org.controller'
import { checkPermission } from 'middlewares'
import { OrgPermissions } from './../constants'

export class OrgRoute {
  public path = '/org'
  public router = Router()
  public orgController = new OrgController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      'route',
      checkPermission(OrgPermissions.ORG_RETRIEVE_ALL),
      this.orgController.orgRetrieveAll
    )

    this.router.get(
      'route',
      checkPermission(OrgPermissions.ORG_RETRIEVE_ONE),
      this.orgController.orgRetrieveAll
    )

    this.router.post(
      'route',
      checkPermission(OrgPermissions.ORG_CREATE),
      this.orgController.orgRetrieveAll
    )

    this.router.patch(
      'route',
      checkPermission(OrgPermissions.ORG_UPDATE),
      this.orgController.orgRetrieveAll
    )

    this.router.delete(
      'route',
      checkPermission(OrgPermissions.ORG_DELETE),
      this.orgController.orgRetrieveAll
    )

    this.router.get(`${this.path}`, this.orgController.get)
    this.router.post(`${this.path}`, this.orgController.createOrg)
    this.router.patch(`${this.path}/group`, this.orgController.updateOrg)
    this.router.patch(`${this.path}/time`, this.orgController.updateTime)
    this.router.patch(`${this.path}/:org`, this.orgController.update)
  }
}
