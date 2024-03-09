import { AnaliticsService } from '@services'
import { NextFunction, Request, Response } from 'express'

export class AnaliticsController {
  private analiticsService = new AnaliticsService()
  public getTotalSale = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error)
    }
  }

  public getBenifit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error)
    }
  }
}
