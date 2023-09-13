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
    this.router.put(`${this.path}/status`,this.userController.updateStatus)
    this.router.put(`${this.path}/`,this.userController.updateInfoUser)
    this.router.post(`${this.path}/send-message`,this.userController.sendMessage)
  }
}


export default UserRoute;