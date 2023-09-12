import { NextFunction, Request, Response } from "express";
import OrderService from "../services/order.service";
import { ParsedQs } from "qs";



class OrderController {
  public orderService = new OrderService();

  public getWithPagination = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      
    } catch (error) {
      next(error)
    }
  }

  public createOrder = async(req:Request,res:Response,next:NextFunction) => {
    try {
      // res.json()
    } catch (error) {
      next(error)
    }
  } 
}


export default OrderController;