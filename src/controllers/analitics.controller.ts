import { AnaliticsService } from '@services'
import { NextFunction, Request, Response } from 'express'

export class AnaliticsController {
  private analiticsService = new AnaliticsService()

  public mostPurchaseUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.analiticsService.mostPurchaseUser())
    } catch (error) {
      next(error)
    }
  }

  public mostSoldProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.analiticsService.mostSoldProduct())
    } catch (error) {
      next(error)
    }
  }

  public totalOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.analiticsService.totalOrders())
    } catch (error) {
      next(error)
    }
  }
}
