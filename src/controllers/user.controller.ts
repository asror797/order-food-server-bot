import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { CreateUserDto } from "../dtos/user.dto";




class UserController {
  public userService = new UserService();

  public findUser = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const telegram_id = Number(req.params.telegramid);
      res.json(await this.userService.isExist(telegram_id));
    } catch (error) {
      next(error)
    }
  }

  public createUser = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.userService.registirNewUser(userData);
      res.json(newUser)
    } catch (error) {
      console.log(error)
    }
  }

}


export default UserController;