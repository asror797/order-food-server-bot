import { NextFunction, Request, Response } from 'express'
import ProductService from '../services/product.service'
import { ParsedQs } from 'qs'
import {
  CreateProduct,
  CreateProductBody,
  UpdateAmountWithType,
} from '../dtos/product.dto'
import { RequestWithUser } from '../interfaces/auth.interface'
import ProductLogService from '../services/product-log.service'
import { httException } from '../exceptions/httpException'

class ProductController {
  public productService = new ProductService()
  public productLogService = new ProductLogService()

  public getProducts = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const search = req.query.search as string
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(
        await this.productService.getProducts({
          page,
          size,
          search,
        }),
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public createProduct = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bodyData: CreateProductBody = req.body
      const productData: CreateProduct = {
        ...bodyData,
        org: req.user?.org || req.body.org,
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
    next: NextFunction,
  ) => {
    try {
      const productData: UpdateAmountWithType = req.body
      const { product, amount, type, cost } = productData
      if (type == true) {
        // let prod
        const editedProduct = await this.productService.increaseAmount({
          product,
          amount,
          cost,
        })

        if (!editedProduct) throw new httException(500, 'somethign went wrong')

        // const mediumPrice = Math.floor((prod?.cost * +product.amount + data.price * data.amount) / (+product.amount + data.amount) );

        await this.productLogService.logCreateForStore({
          product,
          amount,
          type: true,
          org: editedProduct['org'],
          cost: cost,
        })

        res.json(editedProduct)
      } else if (type == false) {
        const editedProduct = await this.productService.decreaseAmount({
          product,
          amount,
          cost,
        })

        if (!editedProduct) throw new httException(500, 'somethign went wrong')

        await this.productLogService.logCreateForStore({
          product,
          amount,
          type: false,
          org: editedProduct['org'],
          cost: cost,
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
    next: NextFunction,
  ) => {
    try {
      const product = req.params.product

      if (!product) throw new httException(400, 'product id required')
      const { name, unit } = req.body

      res.json(
        await this.productService.updateProduct({
          name,
          unit,
          product,
        }),
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /*  public fullUpdateProduct = async(req:Request,res:Response,:next:NextFunction) => {
    try {
      const lunchId = req.params.lunch 
      if(!lunchId) throw new httException(400,'bad request')
      const { name, cost, products, percent_cook } = req.body
      res.json(await this.productService.updateProduct({}))
    } catch (error) {
      next(error)
    }
  } */
}

export default ProductController
