import { NextFunction, Request, Response } from "express";
import OrgService from "../services/org.service";



class OrgController {
  public orgService = new OrgService();


  public get = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.orgService.get())
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public createOrg = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const newOrg = await this.orgService.createOrg(req.body.name_org);
      res.json(newOrg)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public updateOrg = async(req:Request,res:Response,next:NextFunction) => {
    try {
      
    } catch (error) {
      
    }
  }
}

export default OrgController;