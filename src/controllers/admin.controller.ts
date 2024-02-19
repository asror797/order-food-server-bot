import { NextFunction, Request, Response } from 'express'
import AdminService from '../services/admin.service'
import { HttpException } from '@exceptions'

class AdminController {
  public adminService = new AdminService()

  public getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
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
    next: NextFunction
  ) => {
    try {
      // const adminData = req.body
      const newAdmin = await this.adminService.createAdmin(req.body)
      res.json(newAdmin)
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newAdmin = await this.adminService.create(req.body)
      res.json(newAdmin)
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
      res.json(await this.adminService.loginAdmin(req.body))
    } catch (error) {
      next(error)
    }
  }

  public updateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const admin = req.params.admin as string
      if (!admin) throw new HttpException(400, 'admin is required')
      const { newPassword, password, fullname } = req.body
      res.json(
        await this.adminService.updateAdmin({
          admin: admin,
          fullname,
          password,
          newPassword
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public updateAdminRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role } = req.body
      const id = req.params.id as string

      res.json(await this.adminService.updateAdminRole({ id, role }))
    } catch (error) {
      next(error)
    }
  }

  public deleteAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const admin_id = req.params.id

      res.json(await this.adminService.deleteAdmin({ id: admin_id }))
    } catch (error) {
      next(error)
    }
  }
}

export default AdminController
