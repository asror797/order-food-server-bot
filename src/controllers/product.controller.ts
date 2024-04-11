import { NextFunction, Request, Response } from 'express'
import { ParsedQs } from 'qs'
import { CreateProduct, CreateProductBody, UpdateAmountWithType } from '@dtos'
import { RequestWithUser } from '@interfaces'
import { HttpException } from '@exceptions'
import { ProductLogService, ProductService } from '@services'

export class ProductController {
  public productService = new ProductService()
  public productLogService = new ProductLogService()

  public productRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const org = req.query.org as string | undefined
      const search = req.query.search as string | undefined

      res.json(
        await this.productService.productRetrieveAll({
          pageNumber,
          pageSize,
          org,
          search
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public productRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(
        await this.productService.productRetrieveOne({ id: req.params.id })
      )
    } catch (error) {
      next(error)
    }
  }

  public productCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.productService.productCreate(req.body))
    } catch (error) {
      next(error)
    }
  }

  public productChangeAmount = async (req:Request, res:Response, next:NextFunction) => {
    try {
      res.json(await this.productService.productChangeAmount({
        ...req.body,
        id: req.params.id
      }))
    } catch (error) {
      next(error)
    }
  }

  public productUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = req.params.id
      res.json(
        await this.productService.productUpdate({ ...req.body, id: req.body })
      )
    } catch (error) {
      next(error)
    }
  }

  public productDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req)
      res.json('')
    } catch (error) {
      next(error)
    }
  }
}
