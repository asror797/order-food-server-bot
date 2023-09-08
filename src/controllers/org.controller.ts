import { NextFunction, Request } from "express";
import OrgService from "../services/org.service";



class OrgController {
  public orgService = new OrgService();


  public get = async(req:Request,res:Response,next:NextFunction) => {

  }
}

export default OrgController;