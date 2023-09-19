import { NextFunction, Request, Response } from "express";
import AdminService from "../services/admin.service";



class AdminController {
  public adminService = new AdminService();

  public getAdmins = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.adminService.getAdmins())
    } catch (error) {
      next(error)
    }
  }

  public createAdmin = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const adminData = req.body;
      const newAdmin = await this.adminService.createAdmin(req.body)
      res.json(newAdmin)
    } catch (error) {
      next(error)
    }
  }

  public loginAdmin = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.adminService.loginAdmin(req.body))
    } catch (error) {
      next(error)
    }
  }
}


export default AdminController;