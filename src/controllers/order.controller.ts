import { NextFunction, Request, Response } from "express";
import OrderService from "../services/order.service";
import { ParsedQs } from "qs";
import { CreateOrderDto } from "../dtos/order.dto";
import { httException } from "../exceptions/httpException";



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

  public getOrderByUser = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const id = req.params.user as string
      if(!id) throw new httException(400,'user id required')
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      res.json(await this.orderService.getByUser({id,page,size}))
    } catch (error) {
      next(error)
    }
  }

  public getSpentsByUser = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const user = req.params.user as string
      if(!user) throw new httException(400,'user id not found')
      const type = req.query.type  as string  || 'day'
      res.json(await this.orderService.getTotalSpent({
        user: user,
        type: type
      }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}


export default OrderController;