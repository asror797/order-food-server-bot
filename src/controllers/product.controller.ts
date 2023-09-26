import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";
import { ParsedQs } from "qs";
import { CreateProduct, CreateProductBody, UpdateAmountWithType } from "../dtos/product.dto";
import { RequestWithUser } from "../interfaces/auth.interface";
import ProductLogService from "../services/product-log.service";
import { httException } from "../exceptions/httpException";



class ProductController {
  public productService = new ProductService();
  public productLogService = new ProductLogService()


  public getProducts = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      res.json(await this.productService.getProducts(page,size))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public createProduct = async(req:RequestWithUser,res:Response,next:NextFunction) => {
    try {
      const bodyData: CreateProductBody  = req.body;
      const productData: CreateProduct = {
        ...bodyData,
        org: req.user?.org || req.body.org
      }
      res.json(await this.productService.createNew(productData))
    } catch (error) {
      next(error)
    }
  } 

  public editAmountProduct = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const productData:UpdateAmountWithType = req.body;
      const { product , amount , type, cost } = productData;
      if(type == true ) {
        const editedProduct = await this.productService.increaseAmount({
          product,
          amount
        });

        if(!editedProduct) throw new httException(500,'somethign went wrong')

        const logCreated = await this.productLogService.createLog({
          product,
          amount,
          type: true,
          org:editedProduct['org'],
          cost:cost
        });

        res.json(editedProduct);
      } else if(type == false){
        const editedProduct = await this.productService.decreaseAmount({
          product,
          amount
        });

        if(!editedProduct) throw new httException(500,'somethign went wrong')

        const logCreated = await this.productLogService.createLog({
          product,
          amount,
          type: false,
          org:editedProduct['org'],
          cost:cost
        });

        res.json(editedProduct);
      }
    } catch (error) {
      next(error)
    }
  }
}


export default ProductController;
