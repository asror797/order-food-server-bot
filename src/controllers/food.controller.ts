import { NextFunction, Request, Response } from "express";
import FoodService from "../services/food.service";
import { ParsedQs } from "qs";




class FoodController {
  public foodService = new FoodService();

  public getFoods = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      const foods = await this.foodService.getFoods(page,size)
      res.json(foods)
    } catch (error) {
      next(error)
    }
  }
}


export default FoodController;