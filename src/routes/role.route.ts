import { Router } from "express"
import RoleController  from "../controllers/role.controller"
import { checkPermission } from "middlewares"

export class RoleRoute {
  public path = '/role'
  public router = Router()
  public roleController = new RoleController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,checkPermission('get-role'),this.roleController.roleRetrieveAll)
    this.router.post(`${this.path}`,checkPermission('create-role'), this.roleController.createRole)

    this.router.post(`${this.path}/module`,this.roleController.addModule)
    this.router.patch(`${this.path}/module`,this.roleController.updateModule)
    this.router.post(`${this.path}/module/delete`,this.roleController.deleteModule)
    this.router.patch(`${this.path}/module/toggle`,this.roleController.toggleModule)

    this.router.post(`${this.path}/action`,this.roleController.addAction)
    this.router.patch(`${this.path}/action`,this.roleController.updateAction)
    this.router.post(`${this.path}/action/delete`,this.roleController.deleteAction)
    this.router.patch(`${this.path}/action/toggle`,this.roleController.toggleAction)

    this.router.patch(`${this.path}/:id`,this.roleController.updateRole)
    this.router.delete(`${this.path}/:id`,this.roleController.deleteRole)
  }
}
