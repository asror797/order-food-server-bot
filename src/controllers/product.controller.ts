import { NextFunction, Request, Response } from 'express'
import { ParsedQs } from 'qs'
import {
  CreateProduct,
  CreateProductBody,
  UpdateAmountWithType
} from '../dtos/product.dto'
import { RequestWithUser } from '../interfaces/auth.interface'
import { HttpException } from '@exceptions'
import { ProductLogService, ProductService } from '@services'

export class ProductController {
  public productService = new ProductService()
  public productLogService = new ProductLogService()

  public productRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.productService.productRetrieveAll(req.body))
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
      res.json(await this.productService.productRetrieveOne(req.body))
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
      console.log(req)
      res.json('')
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
      console.log(req)
      res.json('')
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

  public getProducts = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const search = req.query.search as string
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(await this.productService.getProducts({ page, size, search }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public createProduct = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bodyData: CreateProductBody = req.body
      const productData: CreateProduct = {
        ...bodyData,
        org: req.user?.org || req.body.org
      }
      res.json(await this.productService.createNew(productData))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public editAmountProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productData: UpdateAmountWithType = req.body
      const { product, amount, type, cost } = productData
      if (type == true) {
        // let prod
        const editedProduct = await this.productService.increaseAmount({
          product,
          amount,
          cost
        })

        if (!editedProduct) throw new HttpException(500, 'somethign went wrong')

        // const mediumPrice = Math.floor((prod?.cost * +product.amount + data.price * data.amount) / (+product.amount + data.amount) );

        await this.productLogService.logCreateForStore({
          product,
          amount,
          type: true,
          org: editedProduct['org'],
          cost: cost
        })

        res.json(editedProduct)
      } else if (type == false) {
        const editedProduct = await this.productService.decreaseAmount({
          product,
          amount,
          cost
        })

        if (!editedProduct) throw new HttpException(500, 'somethign went wrong')

        await this.productLogService.logCreateForStore({
          product,
          amount,
          type: false,
          org: editedProduct['org'],
          cost: cost
        })

        res.json(editedProduct)
      }
    } catch (error) {
      next(error)
    }
  }

  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = req.params.product

      if (!product) throw new HttpException(400, 'product id required')
      const { name, unit } = req.body

      res.json(
        await this.productService.updateProduct({
          name,
          unit,
          product
        })
      )
    } catch (error) {
      next(error)
    }
  }
}
