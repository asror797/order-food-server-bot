import { NextFunction, Request, Response } from 'express'
import { FoodService } from '@services'
import { ParsedQs } from 'qs'

export class FoodController {
  public foodService = new FoodService()

  public foodRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const search = req.query.search as string | undefined
      const category = req.query.org as string | undefined
      const org = req.query.org as string | undefined

      res.json(
        await this.foodService.foodRetrieveAll({
          pageNumber: pageNumber,
          pageSize: pageSize,
          category: category,
          org: org,
          search: search,
          isDashboard: true
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public foodRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const foodId = req.params.id as string
      res.json(await this.foodService.foodRetrieveOne({ id: foodId }))
    } catch (error) {
      next(error)
    }
  }

  public foodCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.foodService.foodCreate(req.body))
    } catch (error) {
      next(error)
    }
  }

  public foodUpdate = async (
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

  public foodProductAdd = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const food = req.params.id
      res.json(await this.foodService.foodProductAdd({ id: food, ...req.body }))
    } catch (error) {
      next(error)
    }
  }

  public foodProductUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const food = req.params.id
      res.json(
        await this.foodService.foodProductUpdate({ id: food, ...req.body })
      )
    } catch (error) {
      next(error)
    }
  }

  public foodProductDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const foodId = req.params.food as string
      const productId = req.params.product as string

      res.json(await this.foodService.foodProductDelete({ foodId, productId }))
    } catch (error) {
      next(error)
    }
  }

  public foodDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const foodId = req.params.id as string
      res.json(await this.foodService.foodDelete({ id: foodId }))
    } catch (error) {
      next(error)
    }
  }
}
