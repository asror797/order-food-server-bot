import { NextFunction, Request, Response } from "express";
import OrderService from "../services/order.service";
import { ParsedQs } from "qs";
import { CreateOrderDto } from "../dtos/order.dto";



class OrderController {
  public orderService = new OrderService();

  public getWithPagination = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      res.json(await this.orderService.getOrders(page,size));
    } catch (error) {
      next(error)
    }
  }

  public createOrder = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const orderData: CreateOrderDto = req.body;
      res.json(await this.orderService.createOrder(orderData))
    } catch (error) {
      next(error)
    }
  } 
}


export default OrderController;