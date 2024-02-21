import { NextFunction, Request, Response } from 'express'
import { CreateLunch } from '../dtos/lunch.dto'
import { LunchService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

export class LunchController {
  readonly lunchService = new LunchService()

  public lunchRetrieveAll = () => {}
  public lunchRetrieveOne = () => {}
  public lunchCreate = () => {}
  public lunchDelete = () => {}

  public getLunch = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(await this.lunchService.getLunches(page, size))
    } catch (error) {
      next(error)
    }
  }

  public createLunch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const base = req.params.base as string

      const lunchData: CreateLunch = req.body
      res.json(
        await this.lunchService.createLunch({
          ...lunchData,
          base: base,
          cost: lunchData.cost,
          name: lunchData.name,
          org: lunchData.org,
          products: lunchData.products
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public getByBase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const base = req.params.base as string
      res.json(await this.lunchService.getByBase(base))
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.lunchService.getLunchByBase(req.params.lunch))
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
      const lunch = req.params.lunch
      res.json(
        await this.lunchService.updateLunch({
          id: lunch,
          ...req.body
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public pushProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunch = req.params.lunch as string
      console.log(req.body.products)
      res.json(
        await this.lunchService.pushProduct({
          lunch: lunch,
          products: req.body.products
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public fullUpdateProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunch = req.params.lunch as string
      if (!lunch) throw new HttpException(400, 'lucnh id required')
      const paylodBody = req.body

      if (!paylodBody.products) {
        throw new HttpException(400, 'products required')
      }
      res.json(
        await this.lunchService.fullUpdateProduct({
          lunch: lunch,
          products: paylodBody.products
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public updateLunch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunchId = req.params.lunch
      if (!lunchId) throw new HttpException(400, 'not found lunch')
      res.json(
        await this.lunchService.fullUpdateLunch({
          ...req.body,
          id: lunchId
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public updateProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunch = req.params.lunch as string
      res.json(
        await this.lunchService.updateProduct({
          lunch: lunch,
          products: req.body.products
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public deleteLunch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunch_id = req.params.id
      if (!lunch_id) throw new HttpException(400, 'lunch id required')

      res.json(await this.lunchService.deleteLunch(lunch_id))
    } catch (error) {
      next(error)
    }
  }

  public deleteProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { lunchId, productId } = req.params

      if (!lunchId || !productId)
        return res.json({
          message: 'product or lunch  is required'
        })
      res.json(
        await this.lunchService.deleteProductOfLunch({
          lunch: lunchId,
          product: productId
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public toggleStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lunchId: string = req.params.id
      res.json(await this.lunchService.toggleStatusLunch({ id: lunchId }))
    } catch (error) {
      next(error)
    }
  }
}
