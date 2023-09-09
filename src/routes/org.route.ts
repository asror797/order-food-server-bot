import { Router } from "express"
import OrgController from "../controllers/org.controller"



class OrgRoute {
  private path = '/org'
  private router = Router()
  private orgController = new OrgController()

  constructor() {

  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.orgController.get)
  }
}

export default OrgRoute;