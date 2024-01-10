import { NextFunction, Request, Response } from 'express'
import AdminService from '../services/admin.service'
import { httException } from '../exceptions/httpException'

class AdminController {
  public adminService = new AdminService()

  public getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.json(await this.adminService.getAdmins())
    } catch (error) {
      next(error)
    }
  }

  public createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // const adminData = req.body
      const newAdmin = await this.adminService.createAdmin(req.body)
      res.json(newAdmin)
    } catch (error) {
      next(error)
    }
  }

  public loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.json(await this.adminService.loginAdmin(req.body))
    } catch (error) {
      next(error)
    }
  }

  public updateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const admin = req.params.admin as string
      if (!admin) throw new httException(400, 'admin is required')
      const { newPassword, password, fullname } = req.body
      res.json(
        await this.adminService.updateAdmin({
          admin: admin,
          fullname,
          password,
          newPassword,
        }),
      )
    } catch (error) {
      next(error)
    }
  }
}

export default AdminController
