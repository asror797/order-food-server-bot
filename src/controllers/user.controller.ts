import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { ChangeStatus, CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { ParsedQs } from "qs";


class UserController {
  public userService = new UserService();

  public getUsers = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      res.json(await this.userService.getUsers(page,size))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

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
      next(error)
    }
  }

  public updateStatus = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const userData:ChangeStatus = req.body.data
      res.json(await this.userService.changeStatus(userData));
    } catch (error) {
      next(error)
    }
  }

  public updateInfoUser = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const userData: UpdateUserDto = req.body
      res.json(await this.userService.updateUser(userData))
    } catch (error) {
      next(error)
    }
  }

  public sendMessage = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.userService.sendMessageToUsers(req.body.message));
    } catch (error) {
      next(error)
    }
  }

}


export default UserController;