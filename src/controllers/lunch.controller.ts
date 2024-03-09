import { NextFunction, Request, Response } from 'express'
import { CreateLunch } from '../dtos/lunch.dto'
import { LunchService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

export class LunchController {
  readonly lunchService = new LunchService()

  public lunchRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const search = req.query.search as string | undefined

      res.json(
        await this.lunchService.lunchRetrieveAll({
          pageNumber,
          pageSize,
          search
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public lunchRetrieveOne = () => {}

  public lunchCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(
        await this.lunchService.lunchCreate({
          ...req.body
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  public lunchDelete = () => {}
}
