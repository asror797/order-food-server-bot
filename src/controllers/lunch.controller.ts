import { NextFunction, Request, Response } from "express";
import { CreateLunch } from "../dtos/lunch.dto";
import LunchService from "../services/lunch.service";
import { ParsedQs } from "qs";
import { httException } from "../exceptions/httpException";





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
      const base = req.params.base as string

      const lunchData:CreateLunch = req.body;
      res.json(await this.lunchService.createLunch({
        base: base,
        cost: lunchData.cost,
        name: lunchData.name,
        org: lunchData.org
      }))
    } catch (error) {
      next(error)
    }
  }

  public getByBase = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const base = req.params.base as string
      res.json(await this.lunchService.getByBase(base))
    } catch (error) {
      next(error)
    }
  }

  public getById = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.lunchService.getLunchByBase(req.params.lunch))
    } catch (error) {
      next(error)
    }
  }

  public lunchUpdate = async(req:Request,res:Response,next:NextFunction) => {
    try {
      
      const lunch = req.params.lunch 
      res.json(await this.lunchService.updateLunch({
        id: lunch,
        ...req.body
      }))
    } catch (error) {
      next(error)
    }
  }

  public pushProduct = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const lunch = req.params.lunch as string
      console.log(req.body.products)
      res.json(await this.lunchService.pushProduct({
        lunch: lunch,
        products: req.body.products
      }))
    } catch (error) {
      next(error)
    }
  }


  public fullUpdateProducts = async(req:Request,res:Response,next:NextFunction) => {
    try {

      const lunch = req.params.lunch as string
      if(!lunch) throw new httException(400,'lucnh id required')
      const paylodBody = req.body

      if(!paylodBody.products) {
        throw new httException(400,'products required')
      }
      res.json(await this.lunchService.fullUpdateProduct({
        lunch: lunch,
        products: paylodBody.products
      }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public updateProducts = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const lunch = req.params.lunch as string
      res.json(await this.lunchService.updateProduct({
        lunch: lunch,
        products: req.body.products
      }))
    } catch (error) {
      next(error)
    }
  }

  public deleteLunch =  async(req:Request,res:Response,next:NextFunction) => {
    try {
      const lunch_id = req.params.id 
      if(!lunch_id) throw new httException(400,'lunch id required')

      res.json(await this.lunchService.deleteLunch(lunch_id))
    } catch (error) {
      
    }
  }
}


export default LunchController;