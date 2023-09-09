import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";



class ProductController {
  public productService = new ProductService();


  public getProducts = async(req:Request,res:Response,next:NextFunction) => {
    try {
      
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public createProduct = async(req:Request,res:Response,next:NextFunction) => {
    try {
      
    } catch (error) {
      next(error)
    }
  } 
}


export default ProductController;
