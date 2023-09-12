import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { AdminLoginDto } from "../dtos/admin.dto";


class AuthController {
  private authService = new AuthService();

  // public sendOtp = (req:Request,res:Response,next:NextFunction) => {
  //   try {
  //     const phone_number: string = req.body.phone_number
  //     res.json(this.authService.loginAdmin(phone_number))
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  public LoginSuperAdmin = (req:Request,res:Response,next:NextFunction) => {
    try {
      const adminData: AdminLoginDto = req.body
      res.json(this.authService.loginAdmin(adminData))
    } catch (error) {
      next(error)
    }
  }

}

export default AuthController;