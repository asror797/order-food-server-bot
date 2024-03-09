import { Router } from 'express'
import { OrgController } from '@controllers'
import { checkPermission } from '@middlewares'
import { OrgPermissions } from '@constants'

export class OrgRoute {
  public path = '/org'
  public router = Router()
  public orgController = new OrgController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      checkPermission(OrgPermissions.ORG_RETRIEVE_ALL),
      this.orgController.orgRetrieveAll
    )

    this.router.get(
      `${this.path}/:id`,
      checkPermission(OrgPermissions.ORG_RETRIEVE_ONE),
      this.orgController.orgRetrieveOne
    )

    this.router.post(
      `${this.path}`,
      checkPermission(OrgPermissions.ORG_CREATE),
      this.orgController.orgCreate
    )

    this.router.patch(
      `${this.path}/:id`,
      checkPermission(OrgPermissions.ORG_UPDATE),
      this.orgController.orgUpdate
    )

    this.router.delete(
      `${this.path}/:id`,
      checkPermission(OrgPermissions.ORG_DELETE),
      this.orgController.orgDelete
    )
  }
}
