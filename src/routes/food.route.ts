import { Router } from "express";
import FoodController from "../controllers/food.controller";



class FoodRoute {
  public path = '/food'
  public router = Router()
  public foodController = new FoodController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,this.foodController.getFoods)
  }
}

export default FoodRoute;