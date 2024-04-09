import { NextFunction, Request, Response } from 'express'
import { OrderService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

export class OrderController {
  public orderService = new OrderService()

  public orderRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const search = req.query.search as string | undefined
      res.json(
        await this.orderService.orderRetrieveAll({
          pageNumber,
          pageSize,
          search
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public orderRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('ok')
    } catch (error) {
      next(error)
    }
  }

  public orderCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('ok')
    } catch (error) {
      next(error)
    }
  }

  public orderUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('ok')
    } catch (error) {
      next(error)
    }
  }

  public orderDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('ok')
    } catch (error) {
      next(error)
    }
  }

  public getWithPagination = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(await this.orderService.getOrders(page, size))
    } catch (error) {
      next(error)
    }
  }

  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderData: any = req.body
      res.json(await this.orderService.createOrder(orderData))
    } catch (error) {
      next(error)
    }
  }

  public getOrderByUser = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.user as string
      if (!id) throw new HttpException(400, 'user id required')
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(await this.orderService.getByUser({ id, page, size }))
    } catch (error) {
      next(error)
    }
  }

  public getSpentsByUser = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.params.user as string
      if (!user) throw new HttpException(400, 'user id not found')
      const type = (req.query.type as string) || 'day'
      res.json(
        await this.orderService.getTotalSpent({
          user: user,
          type: type
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public getAllSpentUser = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.query.user as string | undefined
      const org = req.query.org as string | undefined
      const start = req.query.start as string | undefined
      const end = req.query.end as string | undefined

      if (!user) {
        throw new HttpException(400, 'userId is required')
      }

      res.json(
        await this.orderService.getSpentMoney({
          userId: user,
          endDate: end,
          startDate: start,
          org: org
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public getOldAnalitics = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.params.user as string
      if (!user) throw new HttpException(400, 'user id not found')
      const type = (req.query.type as string) || 'day'
      res.json(
        await this.orderService.getOldAnaltics({
          user: user,
          type: type
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
