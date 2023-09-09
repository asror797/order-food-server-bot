import { Router } from "express";
import UserController from "../controllers/user.controller";



class UserRoute {

  public path = '/user'
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:telegramid`,this.userController.findUser)
    this.router.get(`${this.path}`,this.userController.getUsers)
  }
}


export default UserRoute;