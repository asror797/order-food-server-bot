import { NextFunction, Request, Response } from 'express'
import { FoodService } from '@services'
import { ParsedQs } from 'qs'
import { CreateFood, UpdateFoodDto } from '../dtos/food.dto'
import { HttpException } from '@exceptions'

class FoodController {
  public foodService = new FoodService()

  public getFoods = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      const search = req.query.search as string

      const foods = await this.foodService.getFoods({
        page,
        size,
        search,
      })
      res.json(foods)
    } catch (error) {
      next(error)
    }
  }

  public createFood = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const foodData: CreateFood = req.body
      res.json(await this.foodService.creatNew(foodData))
    } catch (error) {
      next(error)
    }
  }

  public updateFoodPic = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const foodData = req.body
      res.json(await this.foodService.updatePic(foodData))
    } catch (error) {
      next(error)
    }
  }

  public changeStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const status = req.body.status
      const id = req.params.food as string
      if (!id) throw new HttpException(400, 'food on params and is required')
      res.json(
        await this.foodService.changeStatus({
          id,
          status,
        }),
      )
    } catch (error) {
      next(error)
    }
  }

  public updateFood = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const food = req.params.food as string
      if (!food) throw new HttpException(400, 'id required')
      const data: Omit<UpdateFoodDto, 'food'> = req.body
      res.json(
        await this.foodService.updateFood({
          food,
          ...data,
        }),
      )
    } catch (error) {
      next(error)
    }
  }

  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const food = req.params.food as string
      const payload = req.body

      res.json(await this.foodService.deleteProduct({ food, ...payload }))
    } catch (error) {
      next(error)
    }
  }
}

export default FoodController
