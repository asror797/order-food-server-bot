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
    this.router.post(`${this.path}/action`,this.roleController.addAction)
  }
}
