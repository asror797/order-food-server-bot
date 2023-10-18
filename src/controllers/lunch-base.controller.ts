import { NextFunction, Request, Response } from "express";
import LunchBaseService from "../services/lunch-base.service";
import { ParsedQs } from "qs";


class LunchBaseController {
  readonly service = new LunchBaseService()

  public lunchBaseRetrieveAll = async(req:Request<ParsedQs>, res:Response, next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = req.query.search as string
      res.json(await this.service.retrieveAllLunchBases({page,size,search}))
    } catch (error) {
      next(error)
    }
  }

  public lunchBaseCreate = async(req:Request, res:Response, next:NextFunction) => {
    try {
      res.json(await this.service.createLunchBase(req.body))
    } catch (error) {
      next(error)
    }
  }

  public retrieveBase = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const lunchBase = req.params.base as string
      res.json(await this.service.retrieveLunches(lunchBase))
    } catch (error) {
      next(error)
    }
  }

  public lunchBaseUpdate = async(req:Request, res:Response, next:NextFunction) => {
    try {
      
    } catch (error) {
      next(error)
    }
  }

  public getByBase = async(req:Request, res:Response, next:NextFunction ) => {
    try {
      const id = req.params.lunch as string

      res.json(await this.service.getById(id))
    } catch (error) {
      next(error)
    }
  }
}

export default LunchBaseController
