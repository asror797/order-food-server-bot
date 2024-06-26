import { NextFunction, Request, Response } from 'express'
import { AuthService } from '@services'
import { HttpException } from '@exceptions'

export class AuthController {
  private authService = new AuthService()

  public adminAuthSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phoneNumber, password } = req.body
      res.json(
        await this.authService.adminAuthSignIn({
          phoneNumber: phoneNumber,
          password: password
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public adminAuthRefresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.body
      res.json(
        await this.authService.adminAuthRefresh({
          refreshToken
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public adminAuthSignOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error)
    }
  }
}
