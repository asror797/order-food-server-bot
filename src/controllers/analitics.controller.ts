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

  // public getPdf = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     res.json(await this.analiticsService.getPdf())
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }
}
