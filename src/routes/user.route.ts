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
    this.router.put(`${this.path}/status/:user`,this.userController.updateStatus)
    this.router.put(`${this.path}/`,this.userController.updateInfoUser)
    this.router.put(`${this.path}/verify/:user`,this.userController.verifyUser)
    this.router.post(`${this.path}/send-message`,this.userController.sendMessage)
    this.router.put(`${this.path}/org/:user`,this.userController.updateOrg)
    this.router.patch(`${this.path}/payment`,this.userController.payment)
    this.router.patch(`${this.path}/role`,this.userController.addRole)
  }
}


export default UserRoute;