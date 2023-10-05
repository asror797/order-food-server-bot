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
    this.router.post(`${this.path}`,this.foodController.createFood)
    this.router.patch(`${this.path}`,this.foodController.updateFoodPic)
    this.router.patch(`${this.path}/update/:food`,this.foodController.updateFood)
    this.router.patch(`${this.path}/:food`,this.foodController.changeStatus)
  }
}

export default FoodRoute;