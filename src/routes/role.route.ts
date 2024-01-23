import { Router } from "express"
import RoleController  from "../controllers/role.controller"

export class RoleRoute {
  public path = '/role'
  public router = Router()
  public roleController = new RoleController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.roleController.roleRetrieveAll)
    this.router.post(`${this.path}`,this.roleController.createRole)
    this.router.post(`${this.path}/module`,this.roleController.addModule)
    this.router.delete(`${this.path}/module`,this.roleController.deleteModule)
    this.router.post(`${this.path}/action`,this.roleController.addAction)
    this.router.delete(`${this.path}/action`,this.roleController.deleteModule)

    this.router.patch(`${this.path}/:id`,this.roleController.updateRole)
    this.router.delete(`${this.path}/:id`,this.roleController.deleteRole)
  }
}
