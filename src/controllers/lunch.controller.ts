import { NextFunction, Request, Response } from "express";
import { CreateLunch } from "../dtos/lunch.dto";
import LunchService from "../services/lunch.service";
import { ParsedQs } from "qs";





class LunchController {
  readonly lunchService = new LunchService();

  public getLunch = async (req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      res.json(await this.lunchService.getLunches(page,size))
    } catch (error) {
      next(error)
    }
  }

  public createLunch = async (req:Request,res:Response,next:NextFunction) => {
    try {
      const lunchData:CreateLunch = req.body;
      res.json(await this.lunchService.createLunch(lunchData))
    } catch (error) {
      next(error)
    }
  }
}


export default LunchController;