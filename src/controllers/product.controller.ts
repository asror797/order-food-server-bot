import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";
import { ParsedQs } from "qs";
import { CreateProduct, CreateProductBody } from "../dtos/product.dto";
import { RequestWithUser } from "../interfaces/auth.interface";



class ProductController {
  public productService = new ProductService();


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
}


export default ProductController;
