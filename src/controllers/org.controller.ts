import { NextFunction, Request, Response } from "express";
import OrgService from "../services/org.service";
import { ParsedQs } from "qs";
import { Update, UpdateGroupDto } from "../dtos/org.dto";



class OrgController {
  public orgService = new OrgService();


  public get = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      res.json(await this.orgService.get(page,size))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public createOrg = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const newOrg = await this.orgService.createOrg(req.body.name_org);
      res.json({
        _id: newOrg['_id'],
        name_org: newOrg.name_org
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public updateOrg = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const orgData:UpdateGroupDto = req.body;
      res.json(await this.orgService.updateGroupId(orgData))
    } catch (error) {
      next(error)
    }
  }

  public update = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const org: string = req.params.org 
      const updateData: Omit<Update,'org'> = req.body
      res.json(await this.orgService.update({org,...updateData}))
    } catch (error) {
      next(error)
    }
  }

  public updateTime = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const orgData: any = req.body
      res.json(await this.orgService.updateOrg({
        org: orgData.Org,
        time: orgData.time
      }))
    } catch (error) {
      next(error)
    }
  }
}

export default OrgController;