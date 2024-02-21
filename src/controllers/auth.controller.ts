import { NextFunction, Request, Response } from 'express'
import { AuthService } from '@services'
import { AdminLoginDto } from '../dtos/admin.dto'
import { HttpException } from '@exceptions'

export class AuthController {
  private authService = new AuthService()

  // public sendOtp = (req:Request,res:Response,next:NextFunction) => {
  //   try {
  //     const phone_number: string = req.body.phone_number
  //     res.json(this.authService.loginAdmin(phone_number))
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  public LoginSuperAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const adminData: AdminLoginDto = req.body
      res.json(this.authService.loginAdmin(adminData))
    } catch (error) {
      next(error)
    }
  }

  public loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phoneNumber, password } = req.body
      console.log(req.body)
      if (!phoneNumber || !password) {
        throw new HttpException(400, 'phoneNumber or password is wrong 1')
      }
      res.json(await this.authService.login({ phoneNumber, password }))
    } catch (error) {
      next(error)
    }
  }
}
