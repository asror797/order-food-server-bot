import { Router } from "express"
import OrgController from "../controllers/org.controller"



class OrgRoute {
  public path = '/org'
  public router = Router()
  public orgController = new OrgController()

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.orgController.get)
    this.router.post(`${this.path}`,this.orgController.createOrg)
  }
}

export default OrgRoute;