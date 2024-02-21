import { NextFunction, Request, Response } from 'express'
import { LunchBaseService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

export class LunchBaseController {
  readonly service = new LunchBaseService()

  public lunchBaseRetrieveOne = () => {}
  public lunchBaseDelete = () => {}

  public lunchBaseRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      const search = req.query.search as string
      res.json(await this.service.retrieveAllLunchBases({ page, size, search }))
    } catch (error) {
      next(error)
    }
  }

  public lunchBaseCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.service.createLunchBase(req.body))
    } catch (error) {
      next(error)
    }
  }

  public retrieveBase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunchBase = req.params.base as string
      res.json(await this.service.retrieveLunches(lunchBase))
    } catch (error) {
      next(error)
    }
  }

  public toggleStatusBase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const baseId: string = req.params.id as string
      if (!baseId) {
        throw new HttpException(400, 'baseId is required')
      }
      res.json(await this.service.toggleStatus({ id: baseId }))
    } catch (error) {
      next(error)
    }
  }

  public lunchBaseUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error)
    }
  }

  public getByBase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.lunch as string

      res.json(await this.service.getById(id))
    } catch (error) {
      next(error)
    }
  }
}
