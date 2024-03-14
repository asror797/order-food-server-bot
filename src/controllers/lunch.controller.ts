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

  public lunchRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.lunchService.lunchRetrieveOne({ id: req.params.id }))
    } catch (error) {
      next(error)
    }
  }

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

  public lunchProductAdd = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunch = req.params.id

      res.json(
        await this.lunchService.lunchProductAdd({ id: lunch, ...req.body })
      )
    } catch (error) {
      next(error)
    }
  }

  public lunchProductUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.params.id
      res.json()
    } catch (error) {
      next(error)
    }
  }

  public lunchProductDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunch = req.params.lunch
      const product = req.params.product

      res.json(await this.lunchService.lunchProductDelete({ lunch, product }))
    } catch (error) {
      next(error)
    }
  }

  public lunchUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunchId = req.params.id
      res.json(
        await this.lunchService.lunchUpdate({ ...req.body, id: lunchId })
      )
    } catch (error) {
      next(error)
    }
  }

  public lunchDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunchId = req.params.id
      res.json(await this.lunchService.lunchDelete({ id: lunchId }))
    } catch (error) {
      next(error)
    }
  }
}
