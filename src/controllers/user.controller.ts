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

  public editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: EditUserDto = req.body
      res.json(await this.userService.editUser(payload))
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

  public transitPayment = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.params.user as string
      const paymentData: Payment = req.body
      res.json(
        await this.userService.transitPayment({
          ...paymentData,
          user
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public addRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const updatedUser = await this.userService.addRole(req.body)
      res.json({})
    } catch (error) {
      next(error)
    }
  }

  public updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type } = req.body

      if (type === true) {
        // const updatedUser = await this.userService.addRole({
        //   user,
        //   role,
        // })

        // if (!updatedUser) throw new HttpException(500, 'somethign went wrong')
        res.json({})
      } else if (type === false) {
        // const updatedUser = await this.userService.removeRole({
        //   user,
        //   role,
        // })

        // if (!updatedUser) throw new HttpException(500, 'somethign went wrong')
        // res.json({
        //   _id: updatedUser['_id'],
        //   first_name: updatedUser.first_name,
        //   last_name: updatedUser.last_name,
        //   roles: updatedUser.roles,
        // })
        res.json({})
      } else {
        throw new HttpException(400, 'invalid request')
      }
    } catch (error) {
      next(error)
    }
  }

  public payment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, amount, user } = req.body
      if (type == true) {
        res.json(await this.paymentService.increase({ user, amount }))
      } else if (type == false) {
        res.json(await this.paymentService.dicrease({ user, amount }))
      } else {
        res.json({
          message: 'bad request',
          status: 400
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public SearchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.query.search)
      res.json(await this.userService.searchUser(req.query.search as string))
    } catch (error) {
      next(error)
    }
  }
}
