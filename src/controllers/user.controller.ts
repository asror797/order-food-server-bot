import { NextFunction, Request, Response } from 'express'
import { UserService } from '@services'
import { EditUserDto, sendMessage } from '../dtos/user.dto'
import { ParsedQs } from 'qs'

export class UserController {
  private userService = new UserService()

  public userRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const search = req.query.search as string
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const org = req.query.org as string

      res.json(
        await this.userService.userRetrieveAll({
          pageNumber,
          pageSize,
          search,
          org
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public userRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id
      res.json(await this.userService.userRetrieveOne({ id: userId }))
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

  public userUpdateBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.params.id as string
      res.json(
        await this.userService.userUpdateBalance({
          ...req.body,
          user: user
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public userDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.userService.userDelete({ id: req.params.id }))
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
      const msgData: sendMessage = req.body
      res.json(await this.userService.sendMessageToUsers(msgData))
    } catch (error) {
      next(error)
    }
  }
}
