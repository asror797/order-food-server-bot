import { Router } from "express";
import UserController from "../controllers/user.controller";



class UserRoute {

  public path = '/'
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get('/:telegramid',this.userController.findUser)
  }
}


export default UserRoute;