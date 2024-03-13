import { NextFunction, Request, Response } from 'express'
import { UserService } from '@services'
import {
  CreateUserDto,
  EditUserDto,
  Payment,
  SendMessae,
  UpdateUserDto
} from '../dtos/user.dto'
import { ParsedQs } from 'qs'
import { PaymentService } from '@services'
import { HttpException } from '@exceptions'

export class UserController {
  public userService = new UserService()
  public paymentService = new PaymentService()

  public userRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const search = req.query.search as string
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10

      res.json(
        await this.userService.userRetrieveAll({
          pageNumber,
          pageSize,
          search
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const telegram_id = Number(req.params.telegramid)
      res.json(await this.userService.isExist(telegram_id))
    } catch (error) {
      next(error)
    }
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: CreateUserDto = req.body
      const newUser = await this.userService.registirNewUser(userData)
      res.json(newUser)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: string = req.params.user
      res.json(
        await this.userService.updateUser({
          _id: userData,
          first_name: '',
          last_name: '',
          type: 'verify',
          is_active: true,
          is_verified: true,
          org: ''
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      interface Status {
        is_active: boolean
      }
      const userData: string = req.params.user
      const userStatus: Status = req.body

      res.json(
        await this.userService.updateUser({
          _id: userData,
          first_name: '',
          last_name: '',
          type: 'status',
          org: '',
          is_active: userStatus.is_active
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public updateOrg = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user: string = req.params.user as string
      const org: string = req.body.org
      res.json(await this.userService.ChangeOrg({ user: user, org: org }))
    } catch (error) {
      next(error)
    }
  }

  public userUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id as string
      const payload: EditUserDto = {
        id: userId,
        ...req.body
      }

      res.json(await this.userService.userUpdate(payload))
    } catch (error) {
      next(error)
    }
  }

  public updateInfoUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: UpdateUserDto = req.body
      res.json(await this.userService.updateUser(userData))
    } catch (error) {
      next(error)
    }
  }

  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const msgData: SendMessae = req.body
      res.json(await this.userService.sendMessageToUsers(msgData))
    } catch (error) {
      next(error)
    }
  }
}
