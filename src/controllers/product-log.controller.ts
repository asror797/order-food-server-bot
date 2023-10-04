import { NextFunction, Request, Response } from "express";
import ProductLogService from "../services/product-log.service";

class ProductLogController {

  public logs = new ProductLogService()

  public getLogs = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.logs.getLog())
    } catch (error) {
      next(error)
    }
  }
} 

export default ProductLogController;