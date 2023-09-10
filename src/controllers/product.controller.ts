import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";
import { ParsedQs } from "qs";



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

  public createProduct = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const name: string  = req.body.name;

      // res.json(await this.productService.createNew(name))
    } catch (error) {
      next(error)
    }
  } 
}


export default ProductController;
