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

  public getUserMonthlyAnalitics = async(req:Request,res:Response,next:NextFunction) => {
    try {
      if (!req.params.id) throw new Error('Not found user')
      res.json(await this.analiticsService.getUserMonthlyAnalitics({ user: req.params.id }))
    } catch (error) {
      next(error)
    }
  }
}
