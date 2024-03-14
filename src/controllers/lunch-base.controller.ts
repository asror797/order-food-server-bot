import { NextFunction, Request, Response, json } from 'express'
import { LunchBaseService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

export class LunchBaseController {
  readonly lunchbaseService = new LunchBaseService()

  public lunchBaseRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      const search = req.query.search as string
      res.json(
        await this.lunchbaseService.retrieveAllLunchBases({
          page,
          size,
          search
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public lunchBaseRetrieveOne = async (req:Request,res:Response,next:NextFunction) => {
    try {
      const lunchbaseId = req.params.id 
      res.json(await this.lunchbaseService.lunchBaseRetrieveOne({ id: lunchbaseId }))
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
      res.json(await this.lunchbaseService.lunchBaseCreate(req.body))
    } catch (error) {
      next(error)
    }
  }

  // public retrieveBase = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const lunchBase = req.params.base as string
  //     res.json(await this.lunchbaseService.retrieveLunches(lunchBase))
  //   } catch (error) {
  //     next(error)
  //   }
  // }

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
      res.json(await this.lunchbaseService.toggleStatus({ id: baseId }))
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
      const lunchbaseId = req.params.id as string
      res.json(
        await this.lunchbaseService.lunchBaseUpdate({
          ...req.body,
          id: lunchbaseId
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public lunchBaseDelete = async(req:Request,res:Response,next:NextFunction) => {
    try {
      res.json(await this.lunchbaseService.lunchBaseDelete({ id: req.params.id }))
    } catch (error) {
      next(error)
    }
  }
}
