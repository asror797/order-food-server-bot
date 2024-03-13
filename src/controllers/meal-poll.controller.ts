import { MealPollService } from '@services'
import { NextFunction, Request, Response } from 'express'

export class MealPollController {
  private mealpollService = new MealPollService()

  public mealpollRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(
        await this.mealpollService.mealPollRetrieveAll({
          pageNumber: 1,
          pageSize: 10
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public mealpollRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(
        await this.mealpollService.mealPollRetrieveOne({ id: '', search: '' })
      )
    } catch (error) {
      next(error)
    }
  }
}
